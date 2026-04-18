// main.js
// منطق الواجهة المعدل: ربط firebase.js كملف واحد، إصلاح الريفريش، drawer للقوائم، منع pull-to-refresh، شات عام مع seen
// هذا الملف يفترض أن firebase.js يصدر: auth, db, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
// collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, arrayUnion, where, ensureUserProfile

import {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  ensureUserProfile,
  // Firestore helpers
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  where
} from './firebase.js';

/* ---------------------------
   إعدادات المستخدم الوهمي
   --------------------------- */
const DEMO_EMAIL = 'demo@shatnar.test';
const DEMO_PASS = 'Demo1234';
const DEMO_PROFILE = {
  displayName: 'مستخدم تجريبي',
  bio: 'هذا ملف تجريبي لاختبار واجهة شات نار.',
  nationality: 'مصر',
  gender: 'ذكر'
};

/* ---------------------------
   عناصر DOM
   --------------------------- */
const privateListBtn = document.getElementById('privateListBtn');
const privateListDrawer = document.getElementById('privateListDrawer');
const closePrivateDrawer = document.getElementById('closePrivateDrawer');
const privateThreadsList = document.getElementById('privateThreadsList');
const openAllThreads = document.getElementById('openAllThreads');

const menuBtn = document.getElementById('menuBtn');
const profileDrawer = document.getElementById('profileDrawer');
const closeProfileDrawer = document.getElementById('closeProfileDrawer');
const profileName = document.getElementById('profileName');
const profileBio = document.getElementById('profileBio');
const editProfileBtn = document.getElementById('editProfileBtn');
const appSettingsBtn = document.getElementById('appSettingsBtn');
const viewProfileBtn = document.getElementById('viewProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');

const brandBtn = document.getElementById('brandBtn');

const userSearch = document.getElementById('userSearch');
const searchClear = document.getElementById('searchClear');

const onlineCount = document.getElementById('onlineCount');
const onlineUsersList = document.getElementById('onlineUsersList');

const publicMessages = document.getElementById('publicMessages');
const publicMessageForm = document.getElementById('publicMessageForm');
const publicMessageInput = document.getElementById('publicMessageInput');
const sendPublicBtn = document.getElementById('sendPublicBtn');

const toastEl = document.getElementById('toast');
const pullIndicator = document.getElementById('pullIndicator');

/* ---------------------------
   حالة محلية
   --------------------------- */
let currentUser = null;
let unsubscribePublic = null;

/* ---------------------------
   أدوات مساعدة للـ UI
   --------------------------- */
function showToast(text, timeout = 3000) {
  if (!toastEl) return;
  toastEl.textContent = text;
  toastEl.hidden = false;
  setTimeout(() => {
    toastEl.hidden = true;
  }, timeout);
}

function openDrawer(drawerEl) {
  if (!drawerEl) return;
  drawerEl.setAttribute('aria-hidden', 'false');
}
function closeDrawer(drawerEl) {
  if (!drawerEl) return;
  drawerEl.setAttribute('aria-hidden', 'true');
}
function toggleDrawer(drawerEl) {
  if (!drawerEl) return;
  const isHidden = drawerEl.getAttribute('aria-hidden') === 'true';
  drawerEl.setAttribute('aria-hidden', String(!isHidden));
}

/* تنسيق وقت بسيط */
function formatTime(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/* هروب HTML لمنع XSS */
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/* ---------------------------
   أحداث الواجهة والتعامل مع القوائم
   --------------------------- */
function attachUIHandlers() {
  // فتح/إغلاق drawer الرسائل الخاصة
  privateListBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer(privateListDrawer);
    closeDrawer(profileDrawer);
  });
  closePrivateDrawer.addEventListener('click', () => closeDrawer(privateListDrawer));

  // فتح/إغلاق drawer البروفايل
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer(profileDrawer);
    closeDrawer(privateListDrawer);
  });
  closeProfileDrawer.addEventListener('click', () => closeDrawer(profileDrawer));

  // إغلاق القوائم عند النقر خارجها
  document.addEventListener('click', () => {
    closeDrawer(privateListDrawer);
    closeDrawer(profileDrawer);
  });
  // منع إغلاق عند النقر داخل drawer
  [privateListDrawer, profileDrawer].forEach(d => {
    if (!d) return;
    d.addEventListener('click', (e) => e.stopPropagation());
  });

  // أزرار البروفايل
  appSettingsBtn.addEventListener('click', () => showToast('إعدادات التطبيق (وهمية)'));
  viewProfileBtn.addEventListener('click', () => showToast('عرض الملف (وهمي)'));
  editProfileBtn.addEventListener('click', () => showToast('تحرير الملف (وهمي)'));
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      showToast('تم تسجيل الخروج');
    } catch (err) {
      console.error(err);
      showToast('خطأ أثناء تسجيل الخروج');
    }
  });

  // شريط البحث
  userSearch.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    filterOnlineUsers(q);
  });
  searchClear.addEventListener('click', () => {
    userSearch.value = '';
    filterOnlineUsers('');
  });

  // إرسال رسالة عامة (زر)
  sendPublicBtn.addEventListener('click', async () => {
    const text = publicMessageInput.value.trim();
    if (!text) return;
    await sendPublicMessage(text);
    publicMessageInput.value = '';
  });

  // منع submit الافتراضي لأي نموذج (حماية إضافية)
  publicMessageForm.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  // زر العلامة التجارية يمنع السحب الافتراضي عند الضغط القوي
  brandBtn.addEventListener('touchstart', (e) => {
    e.stopPropagation();
  });
}

/* ---------------------------
   بيانات وهمية للمستخدمين المتصلين (للاختبار)
   --------------------------- */
const MOCK_ONLINE_USERS = [
  { uid: 'u_demo', name: 'مستخدم تجريبي', status: 'متصل' },
  { uid: 'u_1', name: 'سارة', status: 'متصل' },
  { uid: 'u_2', name: 'أحمد', status: 'متصل' },
  { uid: 'u_3', name: 'ليلى', status: 'متصل' }
];

function renderOnlineUsers(list = MOCK_ONLINE_USERS) {
  onlineUsersList.innerHTML = '';
  list.forEach(u => {
    const li = document.createElement('li');
    li.className = 'user-item';
    li.dataset.uid = u.uid;
    li.innerHTML = `
      <div class="user-avatar"><img src="assets/avatar-demo.png" alt="${u.name}"/></div>
      <div class="user-meta">
        <div class="user-name">${u.name}</div>
        <div class="user-status">${u.status}</div>
      </div>
    `;
    li.addEventListener('click', () => {
      showToast(`فتح محادثة خاصة مع ${u.name} (وهمي)`);
    });
    onlineUsersList.appendChild(li);
  });
  onlineCount.textContent = String(list.length);
}

/* ---------------------------
   قائمة المحادثات الخاصة (وهمية)
   --------------------------- */
function renderPrivateThreadsMock() {
  privateThreadsList.innerHTML = '';
  const item = document.createElement('li');
  item.className = 'thread-item';
  item.innerHTML = `
    <div style="flex:1;min-width:0">
      <div class="thread-meta">
        <div class="thread-name">سارة</div>
        <div class="thread-time">12:34</div>
      </div>
      <div class="thread-last">آخر رسالة: مرحباً، كيف الحال؟</div>
    </div>
    <div style="margin-inline-start:8px"><div class="thread-unread">1</div></div>
  `;
  item.addEventListener('click', () => {
    showToast('فتح محادثة خاصة مع سارة (وهمي)');
  });
  privateThreadsList.appendChild(item);
}

/* ---------------------------
   Firebase: تسجيل وهمي وتسجيل الدخول
   --------------------------- */
async function ensureDemoUserAndSignIn() {
  try {
    // محاولة إنشاء المستخدم التجريبي (إن لم يكن موجوداً)
    await createUserWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASS);
    console.log('Demo user created');
  } catch (err) {
    // إذا كان المستخدم موجوداً سيُرمى خطأ؛ نتجاهله
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASS);
    // تأكد من وجود ملف المستخدم في مجموعة users
    await ensureUserProfile(cred.user.uid, { displayName: DEMO_PROFILE.displayName, email: DEMO_EMAIL, nationality: DEMO_PROFILE.nationality, gender: DEMO_PROFILE.gender, bio: DEMO_PROFILE.bio });
    console.log('Signed in as demo:', cred.user.uid);
  } catch (err) {
    console.error('Sign-in error:', err);
    showToast('خطأ في تسجيل الدخول التجريبي');
  }
}

/* ---------------------------
   شات عام: إرسال واستقبال ورسائل seen
   --------------------------- */
const GLOBAL_THREAD_ID = 'global';

async function sendPublicMessage(text) {
  if (!auth.currentUser) {
    showToast('يجب تسجيل الدخول لإرسال رسالة');
    return;
  }
  try {
    await addDoc(collection(db, 'messages'), {
      threadId: GLOBAL_THREAD_ID,
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName || DEMO_PROFILE.displayName,
      text: text,
      timestamp: serverTimestamp(),
      deliveredTo: [],
      seenBy: []
    });
  } catch (err) {
    console.error('sendPublicMessage error', err);
    showToast('خطأ أثناء إرسال الرسالة');
  }
}

function startListeningPublicMessages() {
  if (unsubscribePublic) unsubscribePublic();

  const q = query(collection(db, 'messages'), where('threadId', '==', GLOBAL_THREAD_ID), orderBy('timestamp', 'asc'));
  unsubscribePublic = onSnapshot(q, async (snapshot) => {
    publicMessages.innerHTML = '';
    const docs = [];
    snapshot.forEach(docSnap => {
      docs.push({ id: docSnap.id, data: docSnap.data() });
    });

    for (const d of docs) {
      const m = d.data;
      const li = document.createElement('li');
      const isSelf = currentUser && m.senderId === currentUser.uid;
      li.className = 'message ' + (isSelf ? 'message-self' : 'message-other');

      const senderName = isSelf ? 'أنت' : (m.senderName || m.senderId);
      const timeText = m.timestamp ? formatTime(m.timestamp) : '';

      li.innerHTML = `
        <div class="msg-meta"><span class="msg-sender">${escapeHtml(senderName)}</span> <span class="msg-time">${timeText}</span></div>
        <div class="msg-body">${escapeHtml(m.text || '')}</div>
        <div class="msg-status">${renderStatusIcon(m, isSelf)}</div>
      `;

      publicMessages.appendChild(li);

      // تحديث seenBy عند العرض (نضيف currentUser.uid)
      if (currentUser && Array.isArray(m.seenBy) && !m.seenBy.includes(currentUser.uid)) {
        try {
          const docRef = doc(db, 'messages', d.id);
          await updateDoc(docRef, { seenBy: arrayUnion(currentUser.uid) });
        } catch (err) {
          console.error('update seenBy error', err);
        }
      }
    }

    // تمرير لأسفل
    publicMessages.scrollTop = publicMessages.scrollHeight;
  }, (err) => {
    console.error('onSnapshot error', err);
    showToast('خطأ في جلب الرسائل الحية');
  });
}

/* رسم أيقونة الحالة (delivered/seen) */
function renderStatusIcon(message, isSelf) {
  if (!isSelf) return '';
  const seenBy = Array.isArray(message.seenBy) ? message.seenBy : [];
  if (seenBy.length > 0) {
    return `<i class="fa-solid fa-check-double seen" title="مقروء"></i>`;
  }
  return `<i class="fa-solid fa-check-double" title="تم الإرسال"></i>`;
}

/* ---------------------------
   تهيئة التطبيق بعد المصادقة
   --------------------------- */
function onUserSignedIn(user) {
  currentUser = user;
  profileName.textContent = DEMO_PROFILE.displayName;
  profileBio.textContent = DEMO_PROFILE.bio;

  renderOnlineUsers(MOCK_ONLINE_USERS);
  renderPrivateThreadsMock();
  startListeningPublicMessages();
}

function onUserSignedOut() {
  currentUser = null;
  publicMessages.innerHTML = '<div class="empty-state">سجل الدردشة فارغ. سجّل الدخول لبدء المحادثة.</div>';
  onlineUsersList.innerHTML = '';
  onlineCount.textContent = '0';
  if (unsubscribePublic) unsubscribePublic();
  unsubscribePublic = null;
}

/* ---------------------------
   فلترة المستخدمين المتصلين (بحث حي)
   --------------------------- */
function filterOnlineUsers(queryText) {
  const q = queryText.trim().toLowerCase();
  const items = Array.from(onlineUsersList.querySelectorAll('.user-item'));
  if (!q) {
    items.forEach(i => i.style.display = '');
    return;
  }
  items.forEach(i => {
    const name = i.querySelector('.user-name')?.textContent?.toLowerCase() || '';
    i.style.display = name.includes(q) ? '' : 'none';
  });
}

/* ---------------------------
   منع pull-to-refresh الافتراضي على الموبايل
   - نمنع السلوك الافتراضي أثناء السحب العمودي داخل التطبيق
   - نعرض مؤشر تحديث مخصص عند السحب للأسفل لمسافة محددة
   --------------------------- */
function attachPullToRefreshPrevention() {
  let startY = 0;
  let currentY = 0;
  let pulling = false;
  const threshold = 70; // بكسل لبدء التحديث
  const el = document.scrollingElement || document.documentElement;

  window.addEventListener('touchstart', (e) => {
    if (el.scrollTop === 0) {
      startY = e.touches[0].clientY;
      pulling = true;
    } else {
      pulling = false;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      // منع السلوك الافتراضي للمتصفح (pull-to-refresh)
      e.preventDefault();
      // عرض مؤشر مخصص تدريجيًا
      if (pullIndicator) {
        if (diff > 10) pullIndicator.setAttribute('aria-hidden', 'false');
        pullIndicator.style.transform = `translateX(-50%) translateY(${Math.min(diff - 40, 40)}px)`;
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', async (e) => {
    if (!pulling) return;
    const diff = currentY - startY;
    if (diff > threshold) {
      // تنفيذ تحديث مخصص: إعادة تحميل الرسائل فقط (بدون إعادة تحميل الصفحة)
      if (pullIndicator) {
        pullIndicator.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> جاري التحديث...`;
      }
      // إعادة تشغيل الاشتراك لجلب أحدث الرسائل
      if (unsubscribePublic) unsubscribePublic();
      startListeningPublicMessages();
      setTimeout(() => {
        if (pullIndicator) {
          pullIndicator.setAttribute('aria-hidden', 'true');
          pullIndicator.style.transform = '';
          pullIndicator.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> تحديث`;
        }
      }, 800);
    } else {
      if (pullIndicator) {
        pullIndicator.setAttribute('aria-hidden', 'true');
        pullIndicator.style.transform = '';
      }
    }
    pulling = false;
    startY = currentY = 0;
  }, { passive: true });
}

/* ---------------------------
   بدء التطبيق
   --------------------------- */
async function startApp() {
  attachUIHandlers();
  attachPullToRefreshPrevention();

  // استمع لحالة المصادقة
  onAuthStateChanged(auth, (user) => {
    if (user) {
      onUserSignedIn(user);
    } else {
      onUserSignedOut();
    }
  });

  // إنشاء وتسجيل الدخول بالمستخدم الوهمي تلقائياً للاختبار
  await ensureDemoUserAndSignIn();
}

/* ---------------------------
   تشغيل
   --------------------------- */
startApp().catch(err => {
  console.error('startApp error', err);
  showToast('خطأ في تهيئة التطبيق');
});
