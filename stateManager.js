// ===============================
// 🧠 K3-Z STATE MANAGER (BRAIN ENGINE v1)
// ===============================

const K3Z_STATE_KEY = "K3Z_PROJECT_STATE";

// 🧱 الحالة الافتراضية
const defaultState = {
  version: "K3-Z + BDR1",
  firebase_connected: false,
  auto_focus: false,

  // ⭐ Featured Users System
  featured_mode: "activity_score",

  // 🔔 Notifications system
  notifications_count: 0,

  // 💬 UI state
  ui_state: "home_chat",

  // 🟢 Online / presence (future-ready)
  users_online: 0,

  last_update: Date.now()
};

// 🧠 تحميل الحالة من التخزين
function loadState() {
  const saved = localStorage.getItem(K3Z_STATE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return defaultState;
}

// 💾 حفظ الحالة
function saveState(state) {
  state.last_update = Date.now();
  localStorage.setItem(K3Z_STATE_KEY, JSON.stringify(state));
}

// 🔄 تحديث جزء من الحالة
function updateState(partial) {
  const state = loadState();
  const newState = { ...state, ...partial };
  saveState(newState);
  return newState;
}

// 📊 جلب الحالة الحالية
function getState() {
  return loadState();
}

// 🔔 زيادة الإشعارات
function incrementNotifications() {
  const state = loadState();
  state.notifications_count += 1;
  saveState(state);
  return state.notifications_count;
}

// 🧹 إعادة ضبط (للطوارئ فقط)
function resetState() {
  saveState(defaultState);
}

// ===============================
// 🌐 ربط عالمي (علشان main.js يستخدمه)
// ===============================
window.K3Z_STATE = {
  get: getState,
  update: updateState,
  save: saveState,
  reset: resetState,
  notify: incrementNotifications
};
