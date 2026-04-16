const STORAGE_KEYS = {
  me: "k4_me_profile",
  publicMessages: "k4_public_messages",
  privateThreads: "k4_private_threads",
};

const ONLINE_TTL = 90_000;
const MAX_PUBLIC_MESSAGES = 70;

const demoNames = [
  "سارة",
  "أحمد",
  "مريم",
  "نور",
  "خالد",
  "ليلى",
  "يوسف",
  "هنا",
  "عمر",
  "ريم",
  "طارق",
  "دينا",
  "مهند",
  "شيماء",
  "كريم",
  "جنى",
];

const state = {
  me: loadMe(),
  onlineUsers: buildOnlineUsers(),
  publicMessages: loadPublicMessages(),
  privateThreads: loadPrivateThreads(),
  selectedPrivateUser: null,
  onlineSearch: "",
  sidebarOpen: false,
  privateOpen: false,
};

const els = {};

function $(id) {
  return document.getElementById(id);
}

function uuid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadMe() {
  const fallback = {
    uid: `me-${uuid().slice(0, 8)}`,
    name: "أنت",
    photoURL: "",
    lastSeen: Date.now(),
  };

  return loadJSON(STORAGE_KEYS.me, fallback);
}

function saveMe() {
  saveJSON(STORAGE_KEYS.me, state.me);
}

function buildOnlineUsers() {
  const freshUsers = demoNames.map((name, index) => ({
    uid: `u-${index + 1}`,
    name,
    photoURL: "",
    lastSeen: Date.now() - index * 4_500,
  }));

  const self = {
    uid: state.me.uid,
    name: state.me.name || "أنت",
    photoURL: state.me.photoURL || "",
    lastSeen: Date.now(),
  };

  return [self, ...freshUsers];
}

function loadPublicMessages() {
  const fallback = [
    {
      id: uuid(),
      from: "u-1",
      fromName: "سارة",
      fromPhotoURL: "",
      text: "أهلًا بكم في شات نار.",
      clientTime: Date.now() - 280_000,
    },
    {
      id: uuid(),
      from: "u-2",
      fromName: "أحمد",
      fromPhotoURL: "",
      text: "الواجهة بقت أهدى وأرتب.",
      clientTime: Date.now() - 210_000,
    },
    {
      id: uuid(),
      from: state.me.uid,
      fromName: "أنت",
      fromPhotoURL: "",
      text: "جاهز للتجربة.",
      clientTime: Date.now() - 160_000,
    },
  ];

  return loadJSON(STORAGE_KEYS.publicMessages, fallback);
}

function savePublicMessages() {
  saveJSON(STORAGE_KEYS.publicMessages, state.publicMessages.slice(-MAX_PUBLIC_MESSAGES));
}

function loadPrivateThreads() {
  return loadJSON(STORAGE_KEYS.privateThreads, {});
}

function savePrivateThreads() {
  saveJSON(STORAGE_KEYS.privateThreads, state.privateThreads);
}

function ensureElements() {
  els.sidebar = $("sidebar");
  els.openSidebarBtn = $("openSidebarBtn");
  els.closeSidebarBtn = $("closeSidebarBtn");
  els.chatTitleBtn = $("chatTitleBtn");
  els.onlineSearchInput = $("onlineSearchInput");
  els.onlineCountBadge = $("onlineCountBadge");
  els.onlineList = $("onlineList");
  els.publicMessages = $("publicMessages");
  els.publicForm = $("publicForm");
  els.publicInput = $("publicInput");
  els.activeChannelBadge = $("activeChannelBadge");
  els.chatName = $("chatName");
  els.chatDescription = $("chatDescription");
  els.connectionPill = $("connectionPill");

  els.privateDrawer = $("privateDrawer");
  els.closePrivateBtn = $("closePrivateBtn");
  els.privateTitle = $("privateTitle");
  els.privateSubtitle = $("privateSubtitle");
  els.privateAvatar = $("privateAvatar");
  els.privateMessages = $("privateMessages");
  els.privateForm = $("privateForm");
  els.privateInput = $("privateInput");

  els.overlay = $("overlay");
}

function initials(name) {
  const clean = String(name || "").trim();
  if (!clean) return "؟";
  return clean.slice(0, 1).toUpperCase();
}

function formatClock(ms) {
  if (!ms) return "";
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ms));
  } catch {
    return "";
  }
}

function formatRelative(ms) {
  const diff = Date.now() - ms;
  if (diff < 10_000) return "الآن";
  if (diff < 60_000) return "منذ قليل";
  if (diff < 60 * 60_000) return `منذ ${Math.max(1, Math.round(diff / 60_000))} د`;
  return `منذ ${Math.max(1, Math.round(diff / 3_600_000))} س`;
}

function getThreadId(a, b) {
  return [a, b].sort().join("__");
}

function getCurrentThread() {
  if (!state.selectedPrivateUser) return "";
  return getThreadId(state.me.uid, state.selectedPrivateUser.uid);
}

function setConnectionState(type, text) {
  els.connectionPill.classList.remove("connected", "waiting", "error");
  if (type) els.connectionPill.classList.add(type);
  els.connectionPill.textContent = text;
}

function syncOverlay() {
  els.overlay.classList.toggle("show", state.sidebarOpen || state.privateOpen);
}

function openSidebar() {
  state.sidebarOpen = true;
  els.sidebar.classList.add("open");
  syncOverlay();
}

function closeSidebar() {
  state.sidebarOpen = false;
  els.sidebar.classList.remove("open");
  syncOverlay();
}

function openPrivateDrawer() {
  state.privateOpen = true;
  els.privateDrawer.classList.add("open");
  syncOverlay();
}

function closePrivateDrawer() {
  state.privateOpen = false;
  els.privateDrawer.classList.remove("open");
  syncOverlay();
}

function isOnline(user) {
  return Date.now() - (user.lastSeen || 0) <= ONLINE_TTL;
}

function visibleOnlineUsers() {
  const q = state.onlineSearch.trim().toLowerCase();

  return state.onlineUsers
    .filter((u) => u && u.uid)
    .filter((u) => isOnline(u))
    .filter((u) => {
      if (!q) return true;
      const name = String(u.name || "").toLowerCase();
      return name.includes(q) || String(u.uid).toLowerCase().includes(q);
    })
    .sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));
}

function renderOnlineList() {
  const users = visibleOnlineUsers();
  els.onlineCountBadge.textContent = String(users.length);
  els.onlineList.innerHTML = "";

  if (!users.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = state.onlineSearch ? "لا يوجد نتائج." : "لا يوجد متصلون الآن.";
    els.onlineList.appendChild(empty);
    return;
  }

  users.forEach((user) => {
    const selected = state.selectedPrivateUser && state.selectedPrivateUser.uid === user.uid;
    const isSelf = user.uid === state.me.uid;
    const name = user.name || "مستخدم";

    const row = document.createElement("article");
    row.className = `user-row${selected ? " selected" : ""}`;
    row.dataset.uid = user.uid;
    row.dataset.name = name;
    row.dataset.photo = user.photoURL || "";

    const main = document.createElement("button");
    main.type = "button";
    main.className = "user-main";
    main.setAttribute("aria-label", `فتح ${name}`);

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    if (user.photoURL) {
      avatar.classList.add("photo");
      avatar.style.backgroundImage = `url("${user.photoURL}")`;
      avatar.textContent = "";
    } else {
      avatar.textContent = initials(name);
    }

    const copy = document.createElement("div");
    copy.className = "user-copy";

    const strong = document.createElement("strong");
    strong.textContent = name;

    if (isSelf) {
      const chip = document.createElement("span");
      chip.className = "self-chip";
      chip.textContent = "أنت";
      strong.appendChild(chip);
    }

    const sub = document.createElement("span");
    sub.textContent = isSelf ? "هذا حسابك" : formatRelative(user.lastSeen);

    copy.appendChild(strong);
    copy.appendChild(sub);

    main.appendChild(avatar);
    main.appendChild(copy);

    row.appendChild(main);

    if (!isSelf) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tiny-btn";
      btn.dataset.openPrivate = "1";
      btn.dataset.uid = user.uid;
      btn.dataset.name = name;
      btn.dataset.photo = user.photoURL || "";
      btn.setAttribute("aria-label", `رسالة خاصة إلى ${name}`);
      btn.title = "رسالة خاصة";

      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("class", "icon");
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "#i-message");
      icon.appendChild(use);
      btn.appendChild(icon);

      row.appendChild(btn);
    }

    els.onlineList.appendChild(row);
  });
}

function createMiniAvatar(name, photoURL) {
  const mini = document.createElement("div");
  mini.className = "mini-avatar";

  if (photoURL) {
    mini.classList.add("photo");
    mini.style.backgroundImage = `url("${photoURL}")`;
    mini.textContent = "";
  } else {
    mini.textContent = initials(name);
  }

  return mini;
}

function createMessageCard(message, currentUid) {
  const isSelf = message.from === currentUid;

  const card = document.createElement("article");
  card.className = `msg${isSelf ? " self" : ""}`;

  const head = document.createElement("div");
  head.className = "msg-head";

  const meta = document.createElement("div");
  meta.className = "msg-meta";

  const mini = createMiniAvatar(message.fromName || "مستخدم", message.fromPhotoURL || "");
  const label = document.createElement("div");
  label.className = "name";
  label.textContent = isSelf ? "أنت" : (message.fromName || "مستخدم");

  meta.appendChild(mini);
  meta.appendChild(label);

  const time = document.createElement("div");
  time.className = "msg-time";
  time.textContent = formatClock(message.clientTime || Date.now());

  head.appendChild(meta);
  head.appendChild(time);

  const text = document.createElement("p");
  text.className = "msg-text";
  text.textContent = message.text || "";

  card.appendChild(head);
  card.appendChild(text);

  if (!isSelf && message.from) {
    const actions = document.createElement("div");
    actions.className = "msg-actions";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "msg-action";
    btn.dataset.openPrivate = "1";
    btn.dataset.uid = message.from;
    btn.dataset.name = message.fromName || "مستخدم";
    btn.dataset.photo = message.fromPhotoURL || "";
    btn.setAttribute("aria-label", `رسالة خاصة إلى ${message.fromName || "مستخدم"}`);
    btn.title = "رسالة خاصة";

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("class", "icon");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-message");
    icon.appendChild(use);
    btn.appendChild(icon);

    actions.appendChild(btn);
    card.appendChild(actions);
  }

  return card;
}

function renderPublicMessages() {
  const list = [...state.publicMessages]
    .sort((a, b) => (a.clientTime || 0) - (b.clientTime || 0))
    .slice(-MAX_PUBLIC_MESSAGES);

  els.publicMessages.innerHTML = "";

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state centered";
    empty.textContent = "اكتب أول رسالة.";
    els.publicMessages.appendChild(empty);
    return;
  }

  list.forEach((msg) => {
    els.publicMessages.appendChild(createMessageCard(msg, state.me.uid));
  });

  scrollBottom(els.publicMessages);
}

function getPrivateThreadMessages() {
  if (!state.selectedPrivateUser) return [];
  const threadId = getCurrentThread();
  return (state.privateThreads[threadId] || []).slice().sort((a, b) => (a.clientTime || 0) - (b.clientTime || 0));
}

function renderPrivateHeader() {
  const user = state.selectedPrivateUser;

  if (!user) {
    els.privateTitle.textContent = "محادثة خاصة";
    els.privateSubtitle.textContent = "اختر متصلًا لبدء المحادثة.";
    els.privateAvatar.textContent = "P";
    els.privateAvatar.classList.remove("photo");
    els.privateAvatar.style.backgroundImage = "";
    els.privateInput.disabled = true;
    els.privateInput.placeholder = "اكتب رسالة خاصة...";
    return;
  }

  els.privateTitle.textContent = user.name;
  els.privateSubtitle.textContent = isOnline(user) ? "متصل الآن" : "جاهز للمحادثة";

  if (user.photoURL) {
    els.privateAvatar.classList.add("photo");
    els.privateAvatar.style.backgroundImage = `url("${user.photoURL}")`;
    els.privateAvatar.textContent = "";
  } else {
    els.privateAvatar.classList.remove("photo");
    els.privateAvatar.style.backgroundImage = "";
    els.privateAvatar.textContent = initials(user.name);
  }

  els.privateInput.disabled = false;
  els.privateInput.placeholder = `اكتب رسالة خاصة إلى ${user.name}...`;
}

function renderPrivateMessages() {
  const user = state.selectedPrivateUser;
  els.privateMessages.innerHTML = "";

  if (!user) {
    const empty = document.createElement("div");
    empty.className = "empty-state centered";
    empty.textContent = "اختر متصلًا لفتح محادثة خاصة.";
    els.privateMessages.appendChild(empty);
    return;
  }

  const list = getPrivateThreadMessages();
  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state centered";
    empty.textContent = "ابدأ المحادثة الآن.";
    els.privateMessages.appendChild(empty);
    scrollBottom(els.privateMessages);
    return;
  }

  list.forEach((msg) => {
    els.privateMessages.appendChild(createMessageCard(msg, state.me.uid));
  });

  scrollBottom(els.privateMessages);
}

function scrollBottom(container) {
  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;
  });
}

function selectPrivateUser(user) {
  if (!user || !user.uid) return;
  if (user.uid === state.me.uid) return;

  state.selectedPrivateUser = {
    uid: user.uid,
    name: user.name || "مستخدم",
    photoURL: user.photoURL || "",
    lastSeen: user.lastSeen || Date.now(),
  };

  renderPrivateHeader();
  renderPrivateMessages();
  openPrivateDrawer();
}

function touchMyActivity() {
  const current = state.onlineUsers.find((u) => u.uid === state.me.uid);
  if (current) {
    current.lastSeen = Date.now();
  }
}

function addPublicMessage(text) {
  const clean = String(text || "").trim();
  if (!clean) return;

  const msg = {
    id: uuid(),
    from: state.me.uid,
    fromName: state.me.name || "أنت",
    fromPhotoURL: state.me.photoURL || "",
    text: clean,
    clientTime: Date.now(),
  };

  state.publicMessages.push(msg);
  state.publicMessages = state.publicMessages.slice(-MAX_PUBLIC_MESSAGES);
  savePublicMessages();

  touchMyActivity();
  renderOnlineList();
  renderPublicMessages();
}

function addPrivateMessage(text) {
  if (!state.selectedPrivateUser) return;

  const clean = String(text || "").trim();
  if (!clean) return;

  const threadId = getCurrentThread();
  const list = state.privateThreads[threadId] || [];

  list.push({
    id: uuid(),
    threadId,
    from: state.me.uid,
    fromName: state.me.name || "أنت",
    fromPhotoURL: state.me.photoURL || "",
    to: state.selectedPrivateUser.uid,
    toName: state.selectedPrivateUser.name || "مستخدم",
    text: clean,
    clientTime: Date.now(),
  });

  state.privateThreads[threadId] = list;
  savePrivateThreads();

  touchMyActivity();
  renderOnlineList();
  renderPrivateMessages();
}

function handlePublicSubmit(event) {
  event.preventDefault();
  const text = els.publicInput.value;
  if (!text.trim()) return;
  els.publicInput.value = "";
  addPublicMessage(text);
}

function handlePrivateSubmit(event) {
  event.preventDefault();
  const text = els.privateInput.value;
  if (!text.trim()) return;
  els.privateInput.value = "";
  addPrivateMessage(text);
}

function updateConnectionState() {
  setConnectionState("connected", "محلي");
}

function initEvents() {
  els.openSidebarBtn.addEventListener("click", () => {
    state.sidebarOpen ? closeSidebar() : openSidebar();
  });

  els.closeSidebarBtn.addEventListener("click", closeSidebar);
  els.closePrivateBtn.addEventListener("click", closePrivateDrawer);

  els.overlay.addEventListener("click", () => {
    closeSidebar();
    closePrivateDrawer();
  });

  els.chatTitleBtn.addEventListener("click", () => {
    window.location.reload();
  });

  els.onlineSearchInput.addEventListener("input", () => {
    state.onlineSearch = els.onlineSearchInput.value.trim();
    renderOnlineList();
  });

  els.onlineList.addEventListener("click", (event) => {
    const row = event.target.closest(".user-row");
    if (!row) return;

    const user = {
      uid: row.dataset.uid,
      name: row.dataset.name,
      photoURL: row.dataset.photo || "",
      lastSeen: Date.now(),
    };

    const privateBtn = event.target.closest("[data-open-private]");
    if (privateBtn || row) {
      selectPrivateUser(user);
      closeSidebar();
    }
  });

  els.publicMessages.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-open-private]");
    if (!btn) return;

    selectPrivateUser({
      uid: btn.dataset.uid,
      name: btn.dataset.name,
      photoURL: btn.dataset.photo || "",
      lastSeen: Date.now(),
    });
  });

  els.publicForm.addEventListener("submit", handlePublicSubmit);
  els.privateForm.addEventListener("submit", handlePrivateSubmit);
}

function refreshStateFromStorage() {
  state.me = loadMe();
  state.publicMessages = loadPublicMessages();
  state.privateThreads = loadPrivateThreads();
  state.onlineUsers = buildOnlineUsers();
}

function bootstrap() {
  ensureElements();
  initEvents();
  refreshStateFromStorage();

  updateConnectionState();
  renderOnlineList();
  renderPublicMessages();
  renderPrivateHeader();
  renderPrivateMessages();

  setInterval(() => {
    state.onlineUsers.forEach((u) => {
      if (u.uid !== state.me.uid) return;
      u.lastSeen = Date.now();
    });
    renderOnlineList();
  }, 15_000);

  window.KAREEM4_UI = {
    openPrivateUser: selectPrivateUser,
    refresh: () => window.location.reload(),
    state,
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
