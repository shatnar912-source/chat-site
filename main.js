import {
  db,
  publicMessagesRef,
  usersOnlineRef,
  privateChatsRef,
  profilesRef,
  profileVisitsRef,
  addDoc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "./firebase.js";

window.KAREEM3_STATUS = window.KAREEM3_STATUS || {};
window.KAREEM3_STATUS.main = true;
window.KAREEM3_STATUS.ui = true;

const APP_KEY = "kareem3_mot7add";
const ADMIN_KEY = `${APP_KEY}_admin_mode`;

const MAX_PUBLIC_MESSAGES = 70;
const MAX_PROFILE_VISITS = 20;
const FEATURED_ACTIVITY_WINDOW_MS = 10 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 20 * 1000;

const state = {
  me: loadOrCreateLocalProfile(),
  profilesCache: [],
  publicMessages: [],
  onlineUsers: [],
  featuredUsers: [],
  privateChats: [],
  privateMessages: [],
  activePrivateChatId: null,
  activePrivatePartner: null,
  unreadMap: loadJSON("kareem3_unread_map", {}),
  seenMap: loadJSON("kareem3_seen_map", {}),
  heartbeatTimer: null,

  publicUnsub: null,
  onlineUnsub: null,
  profilesUnsub: null,
  privateChatsUnsub: null,
  privateMessagesUnsub: null,
  visitsUnsub: null,
};

const el = {
  rightPanel: document.getElementById("rightPanel"),
  leftPanel: document.getElementById("leftPanel"),
  openRightPanelBtn: document.getElementById("openRightPanelBtn"),
  openLeftPanelBtn: document.getElementById("openLeftPanelBtn"),
  closeRightPanelBtn: document.getElementById("closeRightPanelBtn"),
  closeLeftPanelBtn: document.getElementById("closeLeftPanelBtn"),

  globalSearchInput: document.getElementById("globalSearchInput"),
  globalSearchResults: document.getElementById("globalSearchResults"),

  publicMessages: document.getElementById("publicMessages"),
  publicMessageForm: document.getElementById("publicMessageForm"),
  publicMessageInput: document.getElementById("publicMessageInput"),

  onlineUsersList: document.getElementById("onlineUsersList"),
  featuredUsersList: document.getElementById("featuredUsersList"),
  privateChatsList: document.getElementById("privateChatsList"),
  privateSearchInput: document.getElementById("privateSearchInput"),

  privateMessagesBadge: document.getElementById("privateMessagesBadge"),
  visitedBadge: document.getElementById("visitedBadge"),
  visitedProfileBtn: document.getElementById("visitedProfileBtn"),
  settingsBtn: document.getElementById("settingsBtn"),
  logoutBtn: document.getElementById("logoutBtn"),

  profileAvatar: document.getElementById("profileAvatar"),
  profileName: document.getElementById("profileName"),
  profileUsername: document.getElementById("profileUsername"),

  mainScreen: document.getElementById("mainScreen"),
  profileScreen: document.getElementById("profileScreen"),
  privateChatScreen: document.getElementById("privateChatScreen"),

  backToMainBtn: document.getElementById("backToMainBtn"),
  profilePageAvatar: document.getElementById("profilePageAvatar"),
  profilePageName: document.getElementById("profilePageName"),
  profilePageUsername: document.getElementById("profilePageUsername"),
  infoName: document.getElementById("infoName"),
  infoAge: document.getElementById("infoAge"),
  infoNationality: document.getElementById("infoNationality"),
  infoGender: document.getElementById("infoGender"),
  infoBio: document.getElementById("infoBio"),
  editProfileBtn: document.getElementById("editProfileBtn"),
  editProfilePanel: document.getElementById("editProfilePanel"),
  editName: document.getElementById("editName"),
  editAge: document.getElementById("editAge"),
  editNationality: document.getElementById("editNationality"),
  editGender: document.getElementById("editGender"),
  editBio: document.getElementById("editBio"),
  saveProfileBtn: document.getElementById("saveProfileBtn"),
  messageFromProfileBtn: document.getElementById("messageFromProfileBtn"),

  backFromPrivateChatBtn: document.getElementById("backFromPrivateChatBtn"),
  privateChatTitle: document.getElementById("privateChatTitle"),
  privateChatSubtitle: document.getElementById("privateChatSubtitle"),
  privateMessages: document.getElementById("privateMessages"),
  privateMessageForm: document.getElementById("privateMessageForm"),
  privateMessageInput: document.getElementById("privateMessageInput"),

  adminFilesPanel: document.getElementById("adminFilesPanel"),
  statusIndex: document.getElementById("statusIndex"),
  statusMain: document.getElementById("statusMain"),
  statusFirebase: document.getElementById("statusFirebase"),
  statusStyle: document.getElementById("statusStyle"),
};

let searchResultsBox = el.globalSearchResults || null;

bootstrap();
bindEvents();

function bootstrap() {
  if (!searchResultsBox) ensureSearchResultsBox();

  renderTopProfile();
  updateSystemStatusUI();
  fillProfileScreen();
  startHeartbeat();

  listenProfiles();
  listenPublicMessages();
  listenOnlineUsers();
  listenPrivateChats();
  listenVisits();

  touchPresence();
  renderAll();
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function now() {
  return Date.now();
}

function uid() {
  return localStorage.getItem(`${APP_KEY}_uid`);
}

function setUid(v) {
  localStorage.setItem(`${APP_KEY}_uid`, v);
}

function makeId(prefix = "u") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

function loadOrCreateLocalProfile() {
  let id = uid();
  if (!id) {
    id = makeId("k3");
    setUid(id);
  }

  const stored = loadJSON(`${APP_KEY}_profile`, null);
  if (stored) return stored;

  const suffix = id.slice(-4).toUpperCase();
  const profile = {
    uid: id,
    name: `ضيف ${suffix}`,
    username: `@guest${suffix.toLowerCase()}`,
    age: "",
    nationality: "",
    gender: "",
    bio: "",
    createdAt: now(),
    updatedAt: now(),
  };

  saveJSON(`${APP_KEY}_profile`, profile);
  return profile;
}

function saveLocalProfile(profile) {
  state.me = { ...state.me, ...profile, updatedAt: now() };
  saveJSON(`${APP_KEY}_profile`, state.me);
  renderTopProfile();
  fillProfileScreen();
  touchPresence();
}

function isAdminMode() {
  return localStorage.getItem(ADMIN_KEY) === "1";
}

function setAdminMode(v) {
  localStorage.setItem(ADMIN_KEY, v ? "1" : "0");
  updateSystemStatusUI();
}

function getDisplayName(p = {}) {
  if (p.name && String(p.name).trim()) return String(p.name).trim();
  if (p.username && String(p.username).trim()) return String(p.username).replace(/^@/, "");
  return "مستخدم";
}

function getUsername(p = {}) {
  if (p.username && String(p.username).trim()) {
    return String(p.username).startsWith("@") ? String(p.username) : `@${p.username}`;
  }
  const base = getDisplayName(p).toLowerCase().replace(/\s+/g, "");
  return `@${base || "user"}`;
}

function safeText(v, fallback = "-") {
  if (v === null || v === undefined || v === "") return fallback;
  return String(v);
}

function esc(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function timeLabel(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ar-EG", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function chatIdFor(a, b) {
  return [a, b].sort().join("__");
}

function setDot(elm, show, value = 0) {
  if (!elm) return;
  if (!show || Number(value) <= 0) {
    elm.classList.add("hidden");
    elm.textContent = "0";
    return;
  }
  elm.classList.remove("hidden");
  elm.textContent = String(value);
}

function setSystemDot(elm, ok) {
  if (!elm) return;
  elm.textContent = "●";
  elm.style.color = ok ? "#34c759" : "#ff3b30";
}

function updateSystemStatusUI() {
  setSystemDot(el.statusIndex, true);
  setSystemDot(el.statusMain, true);
  setSystemDot(el.statusFirebase, !!window.KAREEM3_STATUS.firebase);
  setSystemDot(el.statusStyle, true);
  if (el.adminFilesPanel) {
    el.adminFilesPanel.classList.toggle("hidden", !isAdminMode());
  }
}

function renderTopProfile() {
  const p = state.me || {};
  const name = getDisplayName(p);
  const username = getUsername(p);

  el.profileName.textContent = name;
  el.profileUsername.textContent = username;
  el.profileAvatar.textContent = (name || "م")[0] || "👤";

  el.profilePageName.textContent = name;
  el.profilePageUsername.textContent = username;
  el.profilePageAvatar.textContent = (name || "م")[0] || "👤";
}

function fillProfileScreen() {
  const p = state.me || {};
  el.infoName.textContent = safeText(p.name);
  el.infoAge.textContent = safeText(p.age);
  el.infoNationality.textContent = safeText(p.nationality);
  el.infoGender.textContent = safeText(p.gender);
  el.infoBio.textContent = safeText(p.bio);

  el.editName.value = p.name || "";
  el.editAge.value = p.age || "";
  el.editNationality.value = p.nationality || "";
  el.editGender.value = p.gender || "";
  el.editBio.value = p.bio || "";
}

function bindEvents() {
  el.openRightPanelBtn.addEventListener("click", () => {
    const wasOpen = el.rightPanel.classList.contains("open");
    closePanels();
    if (!wasOpen) el.rightPanel.classList.add("open");
  });

  el.openLeftPanelBtn.addEventListener("click", () => {
    const wasOpen = el.leftPanel.classList.contains("open");
    closePanels();
    if (!wasOpen) el.leftPanel.classList.add("open");
  });

  el.closeRightPanelBtn.addEventListener("click", () => el.rightPanel.classList.remove("open"));
  el.closeLeftPanelBtn.addEventListener("click", () => el.leftPanel.classList.remove("open"));

  el.publicMessageForm.addEventListener("submit", sendPublicMessage);
  el.privateMessageForm.addEventListener("submit", sendPrivateMessage);

  el.globalSearchInput.addEventListener("input", () => {
    renderSearchResults();
    renderOnlineUsers();
    renderFeaturedUsers();
  });

  el.privateSearchInput.addEventListener("input", renderPrivateChats);

  el.editProfileBtn.addEventListener("click", () => {
    el.editProfilePanel.classList.toggle("hidden");
  });

  el.saveProfileBtn.addEventListener("click", () => {
    saveLocalProfile({
      name: el.editName.value.trim(),
      age: el.editAge.value.trim(),
      nationality: el.editNationality.value.trim(),
      gender: el.editGender.value.trim(),
      bio: el.editBio.value.trim(),
    });
    alert("تم حفظ الملف الشخصي ✅");
  });

  el.messageFromProfileBtn.addEventListener("click", () => {
    if (state.activePrivatePartner) openPrivateChatWith(state.activePrivatePartner);
  });

  el.backToMainBtn.addEventListener("click", () => showScreen("main"));
  el.backFromPrivateChatBtn.addEventListener("click", () => showScreen("main"));

  el.visitedProfileBtn.addEventListener("click", () => {
    alert("من زار ملفك هيتفعل بالشكل الكامل لاحقًا.");
  });

  el.settingsBtn.addEventListener("click", () => {
    const next = !isAdminMode();
    setAdminMode(next);
    alert(next ? "تم تفعيل وضع الأدمن مؤقتًا." : "تم إخفاء لوحة الأدمن.");
  });

  el.logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(`${APP_KEY}_profile`);
    localStorage.removeItem(`${APP_KEY}_uid`);
    localStorage.removeItem(ADMIN_KEY);
    location.reload();
  });

  document.addEventListener("click", (e) => {
    const inside =
      searchResultsBox &&
      (searchResultsBox.contains(e.target) || el.globalSearchInput.contains(e.target));
    if (!inside) hideSearchResults();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      touchPresence();
    }
  });

  ["click", "scroll", "keydown", "touchstart", "mousemove"].forEach((evt) => {
    document.addEventListener(evt, touchPresence, { passive: true });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideSearchResults();
      closePanels();
    }
  });

  window.addEventListener("beforeunload", () => {
    try {
      deleteDoc(doc(db, "users_online", state.me.uid));
    } catch {}
  });
}

function closePanels() {
  el.rightPanel.classList.remove("open");
  el.leftPanel.classList.remove("open");
}

function showScreen(name) {
  el.mainScreen.classList.toggle("hidden", name !== "main");
  el.profileScreen.classList.toggle("hidden", name !== "profile");
  el.privateChatScreen.classList.toggle("hidden", name !== "privateChat");
}

function ensureSearchResultsBox() {
  const wrap = document.querySelector(".search-wrap");
  if (!wrap) return;

  const box = document.createElement("div");
  box.id = "globalSearchResults";
  box.className = "search-results hidden card";
  wrap.appendChild(box);
  searchResultsBox = box;
}

function hideSearchResults() {
  if (!searchResultsBox) return;
  searchResultsBox.classList.add("hidden");
  searchResultsBox.innerHTML = "";
}

function startHeartbeat() {
  stopHeartbeat();
  state.heartbeatTimer = setInterval(() => {
    touchPresence();
  }, HEARTBEAT_INTERVAL_MS);
}

function stopHeartbeat() {
  if (state.heartbeatTimer) {
    clearInterval(state.heartbeatTimer);
    state.heartbeatTimer = null;
  }
}

async function touchPresence() {
  if (!state.me) return;

  const payload = {
    uid: state.me.uid,
    name: getDisplayName(state.me),
    username: getUsername(state.me),
    age: state.me.age || "",
    nationality: state.me.nationality || "",
    gender: state.me.gender || "",
    bio: state.me.bio || "",
    joinedAt: state.me.joinedAt || now(),
    lastActive: now(),
  };

  state.me.joinedAt = payload.joinedAt;

  try {
    await setDoc(doc(db, "users_online", state.me.uid), payload, { merge: true });
    await setDoc(doc(db, "profiles", state.me.uid), payload, { merge: true });
  } catch (err) {
    console.warn("touchPresence failed", err);
  }
}

function listenProfiles() {
  if (state.profilesUnsub) state.profilesUnsub();

  state.profilesUnsub = onSnapshot(collection(db, "profiles"), (snap) => {
    state.profilesCache = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderSearchResults();
  });
}

function listenPublicMessages() {
  if (state.publicUnsub) state.publicUnsub();

  const q = query(publicMessagesRef, orderBy("createdAt", "desc"), limit(MAX_PUBLIC_MESSAGES));
  state.publicUnsub = onSnapshot(q, (snap) => {
    state.publicMessages = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .reverse();
    renderPublicMessages();
  });
}

function listenOnlineUsers() {
  if (state.onlineUnsub) state.onlineUnsub();

  const q = query(usersOnlineRef, orderBy("lastActive", "desc"), limit(100));
  state.onlineUnsub = onSnapshot(q, (snap) => {
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const active = all.filter((u) => now() - Number(u.lastActive || 0) <= FEATURED_ACTIVITY_WINDOW_MS);

    state.onlineUsers = active;
    state.featuredUsers = active.slice(0, 8);

    renderOnlineUsers();
    renderFeaturedUsers();
  });
}

function listenPrivateChats() {
  if (state.privateChatsUnsub) state.privateChatsUnsub();

  const q = query(
    collection(db, "private_chats"),
    where("members", "array-contains", state.me.uid)
  );

  state.privateChatsUnsub = onSnapshot(q, (snap) => {
    state.privateChats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    state.privateChats.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
    renderPrivateChats();
    updatePrivateBadge();
  });
}

function listenVisits() {
  if (state.visitsUnsub) state.visitsUnsub();

  const q = query(
    collection(db, "profile_visits"),
    where("ownerUid", "==", state.me.uid)
  );

  state.visitsUnsub = onSnapshot(q, (snap) => {
    const visits = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
      .slice(0, MAX_PROFILE_VISITS);

    setDot(el.visitedBadge, visits.length > 0, visits.length);
  });
}

async function sendPublicMessage(e) {
  e.preventDefault();
  const text = el.publicMessageInput.value.trim();
  if (!text) return;

  const payload = {
    uid: state.me.uid,
    name: getDisplayName(state.me),
    username: getUsername(state.me),
    text,
    createdAt: now(),
  };

  try {
    await addDoc(publicMessagesRef, payload);
    el.publicMessageInput.value = "";
    touchPresence();
  } catch (err) {
    console.error(err);
    alert("تعذر إرسال الرسالة.");
  }
}

function renderPublicMessages() {
  el.publicMessages.innerHTML = "";

  const frag = document.createDocumentFragment();
  for (const m of state.publicMessages) {
    const row = document.createElement("article");
    row.className = "message-item";
    row.classList.toggle("mine", m.uid === state.me.uid);

    row.innerHTML = `
      <div class="message-bubble">
        <div class="message-meta">
          <strong>${esc(m.name || m.username || "مستخدم")}</strong>
          <small>${esc(timeLabel(m.createdAt))}</small>
        </div>
        <p>${esc(m.text || "")}</p>
      </div>
    `;
    frag.appendChild(row);
  }

  el.publicMessages.appendChild(frag);
  el.publicMessages.scrollTop = el.publicMessages.scrollHeight;
}

function renderOnlineUsers() {
  el.onlineUsersList.innerHTML = "";
  const term = el.globalSearchInput.value.trim().toLowerCase();

  const list = state.onlineUsers.filter((u) => {
    const txt = `${u.name || ""} ${u.username || ""} ${u.email || ""}`.toLowerCase();
    return !term || txt.includes(term);
  });

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "لا يوجد متصلون الآن.";
    el.onlineUsersList.appendChild(empty);
    return;
  }

  for (const u of list) {
    el.onlineUsersList.appendChild(buildUserChip(u, () => openProfileView(u, "online")));
  }
}

function renderFeaturedUsers() {
  el.featuredUsersList.innerHTML = "";
  const term = el.globalSearchInput.value.trim().toLowerCase();

  const list = state.featuredUsers.filter((u) => {
    const txt = `${u.name || ""} ${u.username || ""} ${u.email || ""}`.toLowerCase();
    return !term || txt.includes(term);
  });

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "لا يوجد مستخدمون مميزون الآن.";
    el.featuredUsersList.appendChild(empty);
    return;
  }

  for (const u of list) {
    el.featuredUsersList.appendChild(buildUserChip(u, () => openProfileView(u, "featured")));
  }
}

function buildUserChip(user, onClick) {
  const btn = document.createElement("button");
  btn.className = "user-chip";
  const first = (user.name || user.username || "م")[0] || "م";

  btn.innerHTML = `
    <span class="user-avatar">${esc(first)}</span>
    <span class="user-chip-text">
      <strong>${esc(user.name || user.username || "مستخدم")}</strong>
      <small>${esc(user.username || "")}</small>
    </span>
  `;

  btn.addEventListener("click", onClick);
  return btn;
}

function renderSearchResults() {
  if (!searchResultsBox) return;

  const term = el.globalSearchInput.value.trim().toLowerCase();
  if (!term) {
    hideSearchResults();
    return;
  }

  const matches = state.profilesCache
    .filter((p) => {
      const text = `${p.name || ""} ${p.username || ""} ${p.email || ""}`.toLowerCase();
      return text.includes(term);
    })
    .slice(0, 6);

  searchResultsBox.innerHTML = "";

  if (!matches.length) {
    searchResultsBox.innerHTML = `<div class="empty-state">لا توجد نتائج.</div>`;
    searchResultsBox.classList.remove("hidden");
    return;
  }

  for (const p of matches) {
    const btn = document.createElement("button");
    btn.className = "menu-item search-result";
    btn.innerHTML = `
      <span class="menu-icon">👤</span>
      <span class="chat-text">
        <strong>${esc(getDisplayName(p))}</strong>
        <small>${esc(getUsername(p))}</small>
      </span>
    `;

    btn.addEventListener("click", () => {
      hideSearchResults();
      openProfileView(p, "search");
    });

    searchResultsBox.appendChild(btn);
  }

  searchResultsBox.classList.remove("hidden");
}

async function openProfileView(profileUser, source = "list") {
  const p = {
    uid: profileUser.uid,
    name: profileUser.name || getDisplayName(profileUser),
    username: profileUser.username || getUsername(profileUser),
    age: profileUser.age || "",
    nationality: profileUser.nationality || "",
    gender: profileUser.gender || "",
    bio: profileUser.bio || "",
    email: profileUser.email || "",
  };

  state.activePrivatePartner = p;

  el.profilePageAvatar.textContent = (p.name || "م")[0] || "👤";
  el.profilePageName.textContent = p.name;
  el.profilePageUsername.textContent = p.username;

  el.infoName.textContent = safeText(p.name);
  el.infoAge.textContent = safeText(p.age);
  el.infoNationality.textContent = safeText(p.nationality);
  el.infoGender.textContent = safeText(p.gender);
  el.infoBio.textContent = safeText(p.bio);

  el.editName.value = p.name || "";
  el.editAge.value = p.age || "";
  el.editNationality.value = p.nationality || "";
  el.editGender.value = p.gender || "";
  el.editBio.value = p.bio || "";

  showScreen("profile");
  await registerProfileVisitIfNeeded(p.uid, source);
}

async function registerProfileVisitIfNeeded(viewedUid, source) {
  if (!state.me || !viewedUid) return;
  if (viewedUid === state.me.uid) return;

  try {
    await addDoc(collection(db, "profile_visits"), {
      ownerUid: viewedUid,
      visitorUid: state.me.uid,
      visitorName: getDisplayName(state.me),
      visitorUsername: getUsername(state.me),
      createdAt: now(),
      source,
    });
  } catch (err) {
    console.warn("registerProfileVisitIfNeeded failed", err);
  }
}

function openPrivateChatWith(user) {
  if (!user || !user.uid) return;

  const partner = {
    uid: user.uid,
    name: user.name || getDisplayName(user),
    username: user.username || getUsername(user),
    email: user.email || "",
    age: user.age || "",
    nationality: user.nationality || "",
    gender: user.gender || "",
    bio: user.bio || "",
  };

  const chatId = chatIdFor(state.me.uid, partner.uid);
  state.activePrivateChatId = chatId;
  state.activePrivatePartner = partner;

  el.privateChatTitle.textContent = partner.name;
  el.privateChatSubtitle.textContent = partner.username;

  listenPrivateMessages(chatId);
  markChatSeen(chatId);

  showScreen("privateChat");
}

function listenPrivateMessages(chatId) {
  if (state.privateMessagesUnsub) {
    state.privateMessagesUnsub();
    state.privateMessagesUnsub = null;
  }

  const q = query(
    collection(db, "private_chats", chatId, "messages"),
    orderBy("createdAt", "asc"),
    limit(MAX_PUBLIC_MESSAGES)
  );

  state.privateMessagesUnsub = onSnapshot(q, (snap) => {
    state.privateMessages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderPrivateMessages();
    markChatSeen(chatId);
  });
}

function renderPrivateMessages() {
  el.privateMessages.innerHTML = "";

  const frag = document.createDocumentFragment();
  for (const m of state.privateMessages) {
    const row = document.createElement("article");
    row.className = "message-item";
    row.classList.toggle("mine", m.senderId === state.me.uid);

    row.innerHTML = `
      <div class="message-bubble">
        <div class="message-meta">
          <strong>${esc(m.senderName || "مستخدم")}</strong>
          <small>${esc(timeLabel(m.createdAt))}</small>
        </div>
        <p>${esc(m.text || "")}</p>
      </div>
    `;
    frag.appendChild(row);
  }

  el.privateMessages.appendChild(frag);
  el.privateMessages.scrollTop = el.privateMessages.scrollHeight;
}

async function sendPrivateMessage(e) {
  e.preventDefault();
  if (!state.activePrivateChatId || !state.activePrivatePartner) return;

  const text = el.privateMessageInput.value.trim();
  if (!text) return;

  const chatId = state.activePrivateChatId;
  const partner = state.activePrivatePartner;
  const me = state.me;

  const payload = {
    chatId,
    senderId: me.uid,
    receiverId: partner.uid,
    senderName: getDisplayName(me),
    senderUsername: getUsername(me),
    receiverName: partner.name,
    receiverUsername: partner.username,
    text,
    createdAt: now(),
    type: "text",
  };

  try {
    await addDoc(collection(db, "private_chats", chatId, "messages"), payload);
    await setDoc(
      doc(db, "private_chats", chatId),
      {
        chatId,
        members: [me.uid, partner.uid],
        updatedAt: now(),
        lastMessage: text,
        lastMessageBy: me.uid,
        participants: {
          [me.uid]: {
            uid: me.uid,
            name: getDisplayName(me),
            username: getUsername(me),
          },
          [partner.uid]: {
            uid: partner.uid,
            name: partner.name,
            username: partner.username,
          },
        },
      },
      { merge: true }
    );

    el.privateMessageInput.value = "";
    touchPresence();
  } catch (err) {
    console.error(err);
    alert("تعذر إرسال الرسالة الخاصة.");
  }
}

function markChatSeen(chatId) {
  state.seenMap[chatId] = now();
  state.unreadMap[chatId] = 0;
  saveJSON("kareem3_seen_map", state.seenMap);
  saveJSON("kareem3_unread_map", state.unreadMap);
  updatePrivateBadge();
  renderPrivateChats();
}

function updatePrivateBadge() {
  const total = Object.values(state.unreadMap || {}).reduce((sum, n) => sum + Number(n || 0), 0);
  setDot(el.privateMessagesBadge, total > 0, total);
}

function renderPrivateChats() {
  el.privateChatsList.innerHTML = "";

  const term = el.privateSearchInput.value.trim().toLowerCase();
  const list = state.privateChats.filter((chat) => {
    const text = `${chat.lastMessage || ""} ${JSON.stringify(chat.participants || {})}`.toLowerCase();
    return !term || text.includes(term);
  });

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "لا توجد محادثات بعد.";
    el.privateChatsList.appendChild(empty);
    return;
  }

  for (const chat of list) {
    const otherUid = (chat.members || []).find((id) => id !== state.me.uid);
    const other =
      state.profilesCache.find((p) => p.uid === otherUid) ||
      chat.participants?.[otherUid] ||
      {};

    const unread = Number(state.unreadMap[chat.id] || 0);

    const btn = document.createElement("button");
    btn.className = "menu-item chat-item";
    btn.innerHTML = `
      <span class="menu-icon">💬</span>
      <span class="chat-text">
        <strong>${esc(other.name || other.username || "مستخدم")}</strong>
        <small>${esc(chat.lastMessage || "محادثة خاصة")}</small>
      </span>
      ${unread > 0 ? `<span class="badge">${unread}</span>` : ""}
    `;

    btn.addEventListener("click", () => {
      openPrivateChatWith({
        uid: otherUid,
        name: other.name || other.username || "مستخدم",
        username: other.username || "",
        email: other.email || "",
        age: other.age || "",
        nationality: other.nationality || "",
        gender: other.gender || "",
        bio: other.bio || "",
      });
    });

    el.privateChatsList.appendChild(btn);
  }
}

function renderAll() {
  renderTopProfile();
  fillProfileScreen();
  renderPublicMessages();
  renderOnlineUsers();
  renderFeaturedUsers();
  renderPrivateChats();
  updatePrivateBadge();
  updateSystemStatusUI();
}

function renderPublicMessages() {
  el.publicMessages.innerHTML = "";

  const frag = document.createDocumentFragment();
  for (const m of state.publicMessages) {
    const row = document.createElement("article");
    row.className = "message-item";
    row.classList.toggle("mine", m.uid === state.me.uid);

    row.innerHTML = `
      <div class="message-bubble">
        <div class="message-meta">
          <strong>${esc(m.name || m.username || "مستخدم")}</strong>
          <small>${esc(timeLabel(m.createdAt))}</small>
        </div>
        <p>${esc(m.text || "")}</p>
      </div>
    `;
    frag.appendChild(row);
  }

  el.publicMessages.appendChild(frag);
  el.publicMessages.scrollTop = el.publicMessages.scrollHeight;
}

function renderOnlineUsers() {
  el.onlineUsersList.innerHTML = "";
  const term = el.globalSearchInput.value.trim().toLowerCase();

  const list = state.onlineUsers.filter((u) => {
    const txt = `${u.name || ""} ${u.username || ""} ${u.email || ""}`.toLowerCase();
    return !term || txt.includes(term);
  });

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "لا يوجد متصلون الآن.";
    el.onlineUsersList.appendChild(empty);
    return;
  }

  for (const u of list) {
    el.onlineUsersList.appendChild(buildUserChip(u, () => openProfileView(u, "online")));
  }
}

function renderFeaturedUsers() {
  el.featuredUsersList.innerHTML = "";
  const term = el.globalSearchInput.value.trim().toLowerCase();

  const list = state.featuredUsers.filter((u) => {
    const txt = `${u.name || ""} ${u.username || ""} ${u.email || ""}`.toLowerCase();
    return !term || txt.includes(term);
  });

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "لا يوجد مستخدمون مميزون الآن.";
    el.featuredUsersList.appendChild(empty);
    return;
  }

  for (const u of list) {
    el.featuredUsersList.appendChild(buildUserChip(u, () => openProfileView(u, "featured")));
  }
}

function buildUserChip(user, onClick) {
  const btn = document.createElement("button");
  btn.className = "user-chip";
  const first = (user.name || user.username || "م")[0] || "م";

  btn.innerHTML = `
    <span class="user-avatar">${esc(first)}</span>
    <span class="user-chip-text">
      <strong>${esc(user.name || user.username || "مستخدم")}</strong>
      <small>${esc(user.username || "")}</small>
    </span>
  `;

  btn.addEventListener("click", onClick);
  return btn;
}

function sendPublicMessage(e) {
  e.preventDefault();
  const text = el.publicMessageInput.value.trim();
  if (!text) return;

  const payload = {
    uid: state.me.uid,
    name: getDisplayName(state.me),
    username: getUsername(state.me),
    text,
    createdAt: now(),
  };

  addDoc(publicMessagesRef, payload)
    .then(() => {
      el.publicMessageInput.value = "";
      touchPresence();
    })
    .catch((err) => {
      console.error(err);
      alert("تعذر إرسال الرسالة.");
    });
}

async function openProfileView(profileUser, source = "list") {
  const p = {
    uid: profileUser.uid,
    name: profileUser.name || getDisplayName(profileUser),
    username: profileUser.username || getUsername(profileUser),
    age: profileUser.age || "",
    nationality: profileUser.nationality || "",
    gender: profileUser.gender || "",
    bio: profileUser.bio || "",
    email: profileUser.email || "",
  };

  state.activePrivatePartner = p;

  el.profilePageAvatar.textContent = (p.name || "م")[0] || "👤";
  el.profilePageName.textContent = p.name;
  el.profilePageUsername.textContent = p.username;

  el.infoName.textContent = safeText(p.name);
  el.infoAge.textContent = safeText(p.age);
  el.infoNationality.textContent = safeText(p.nationality);
  el.infoGender.textContent = safeText(p.gender);
  el.infoBio.textContent = safeText(p.bio);

  el.editName.value = p.name || "";
  el.editAge.value = p.age || "";
  el.editNationality.value = p.nationality || "";
  el.editGender.value = p.gender || "";
  el.editBio.value = p.bio || "";

  showScreen("profile");
  await registerProfileVisitIfNeeded(p.uid, source);
}

async function registerProfileVisitIfNeeded(viewedUid, source) {
  if (!state.me || !viewedUid) return;
  if (viewedUid === state.me.uid) return;

  try {
    await addDoc(collection(db, "profile_visits"), {
      ownerUid: viewedUid,
      visitorUid: state.me.uid,
      visitorName: getDisplayName(state.me),
      visitorUsername: getUsername(state.me),
      createdAt: now(),
      source,
    });
  } catch (err) {
    console.warn("registerProfileVisitIfNeeded failed", err);
  }
}

async function listenPrivateMessages(chatId) {
  if (state.privateMessagesUnsub) {
    state.privateMessagesUnsub();
    state.privateMessagesUnsub = null;
  }

  const q = query(
    collection(db, "private_chats", chatId, "messages"),
    orderBy("createdAt", "asc"),
    limit(MAX_PUBLIC_MESSAGES)
  );

  state.privateMessagesUnsub = onSnapshot(q, (snap) => {
    state.privateMessages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderPrivateMessages();
    markChatSeen(chatId);
  });
}

function renderPrivateMessages() {
  el.privateMessages.innerHTML = "";

  const frag = document.createDocumentFragment();
  for (const m of state.privateMessages) {
    const row = document.createElement("article");
    row.className = "message-item";
    row.classList.toggle("mine", m.senderId === state.me.uid);

    row.innerHTML = `
      <div class="message-bubble">
        <div class="message-meta">
          <strong>${esc(m.senderName || "مستخدم")}</strong>
          <small>${esc(timeLabel(m.createdAt))}</small>
        </div>
        <p>${esc(m.text || "")}</p>
      </div>
    `;
    frag.appendChild(row);
  }

  el.privateMessages.appendChild(frag);
  el.privateMessages.scrollTop = el.privateMessages.scrollHeight;
}

function openPrivateChatWith(user) {
  if (!user || !user.uid) return;

  const partner = {
    uid: user.uid,
    name: user.name || getDisplayName(user),
    username: user.username || getUsername(user),
    email: user.email || "",
    age: user.age || "",
    nationality: user.nationality || "",
    gender: user.gender || "",
    bio: user.bio || "",
  };

  const chatId = chatIdFor(state.me.uid, partner.uid);
  state.activePrivateChatId = chatId;
  state.activePrivatePartner = partner;

  el.privateChatTitle.textContent = partner.name;
  el.privateChatSubtitle.textContent = partner.username;

  listenPrivateMessages(chatId);
  markChatSeen(chatId);

  showScreen("privateChat");
}

function sendPrivateMessage(e) {
  e.preventDefault();
  if (!state.activePrivateChatId || !state.activePrivatePartner) return;

  const text = el.privateMessageInput.value.trim();
  if (!text) return;

  const chatId = state.activePrivateChatId;
  const partner = state.activePrivatePartner;
  const me = state.me;

  const payload = {
    chatId,
    senderId: me.uid,
    receiverId: partner.uid,
    senderName: getDisplayName(me),
    senderUsername: getUsername(me),
    receiverName: partner.name,
    receiverUsername: partner.username,
    text,
    createdAt: now(),
    type: "text",
  };

  addDoc(collection(db, "private_chats", chatId, "messages"), payload)
    .then(() => {
      return setDoc(
        doc(db, "private_chats", chatId),
        {
          chatId,
          members: [me.uid, partner.uid],
          updatedAt: now(),
          lastMessage: text,
          lastMessageBy: me.uid,
          participants: {
            [me.uid]: {
              uid: me.uid,
              name: getDisplayName(me),
              username: getUsername(me),
            },
            [partner.uid]: {
              uid: partner.uid,
              name: partner.name,
              username: partner.username,
            },
          },
        },
        { merge: true }
      );
    })
    .then(() => {
      el.privateMessageInput.value = "";
      touchPresence();
    })
    .catch((err) => {
      console.error(err);
      alert("تعذر إرسال الرسالة الخاصة.");
    });
}

function markChatSeen(chatId) {
  state.seenMap[chatId] = now();
  state.unreadMap[chatId] = 0;
  saveJSON("kareem3_seen_map", state.seenMap);
  saveJSON("kareem3_unread_map", state.unreadMap);
  updatePrivateBadge();
  renderPrivateChats();
}

function updatePrivateBadge() {
  const total = Object.values(state.unreadMap || {}).reduce((sum, n) => sum + Number(n || 0), 0);
  setDot(el.privateMessagesBadge, total > 0, total);
}

function renderPrivateChats() {
  el.privateChatsList.innerHTML = "";

  const term = el.privateSearchInput.value.trim().toLowerCase();
  const list = state.privateChats.filter((chat) => {
    const text = `${chat.lastMessage || ""} ${JSON.stringify(chat.participants || {})}`.toLowerCase();
    return !term || text.includes(term);
  });

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "لا توجد محادثات بعد.";
    el.privateChatsList.appendChild(empty);
    return;
  }

  for (const chat of list) {
    const otherUid = (chat.members || []).find((id) => id !== state.me.uid);
    const other =
      state.profilesCache.find((p) => p.uid === otherUid) ||
      chat.participants?.[otherUid] ||
      {};

    const unread = Number(state.unreadMap[chat.id] || 0);

    const btn = document.createElement("button");
    btn.className = "menu-item chat-item";
    btn.innerHTML = `
      <span class="menu-icon">💬</span>
      <span class="chat-text">
        <strong>${esc(other.name || other.username || "مستخدم")}</strong>
        <small>${esc(chat.lastMessage || "محادثة خاصة")}</small>
      </span>
      ${unread > 0 ? `<span class="badge">${unread}</span>` : ""}
    `;

    btn.addEventListener("click", () => {
      openPrivateChatWith({
        uid: otherUid,
        name: other.name || other.username || "مستخدم",
        username: other.username || "",
        email: other.email || "",
        age: other.age || "",
        nationality: other.nationality || "",
        gender: other.gender || "",
        bio: other.bio || "",
      });
    });

    el.privateChatsList.appendChild(btn);
  }
}

function listenPrivateChats() {
  if (state.privateChatsUnsub) state.privateChatsUnsub();

  const q = query(
    privateChatsRef,
    where("members", "array-contains", state.me.uid)
  );

  state.privateChatsUnsub = onSnapshot(q, (snap) => {
    state.privateChats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    state.privateChats.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
    renderPrivateChats();
    updatePrivateBadge();
  });
}

function listenVisits() {
  if (state.visitsUnsub) state.visitsUnsub();

  const q = query(
    profileVisitsRef,
    where("ownerUid", "==", state.me.uid)
  );

  state.visitsUnsub = onSnapshot(q, (snap) => {
    const visits = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
      .slice(0, MAX_PROFILE_VISITS);

    setDot(el.visitedBadge, visits.length > 0, visits.length);
  });
}
