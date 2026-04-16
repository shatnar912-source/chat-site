import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCG2tZ86jmtuc_smyyJE4a0mx7V5kgU6Xc",
  authDomain: "shatnar-f2081.firebaseapp.com",
  projectId: "shatnar-f2081",
  storageBucket: "shatnar-f2081.firebasestorage.app",
  messagingSenderId: "237897103941",
  appId: "1:237897103941:web:989dcd6cae6bc7e84d012c",
  measurementId: "G-HVNTN7FGH4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase persistence error:", error);
});

const USERS_COL = "users";
const PRESENCE_COL = "presence";
const PUBLIC_MESSAGES_COL = "public_messages";
const PRIVATE_MESSAGES_COL = "private_messages";

let currentUser = null;
let currentProfile = {
  uid: null,
  name: "زائر",
  photoURL: "",
  providerId: "anonymous",
};
let heartbeatTimer = null;
let authReadyResolve;
const authReady = new Promise((resolve) => {
  authReadyResolve = resolve;
});

const authListeners = new Set();

function shortGuestName(uid) {
  return `طيف ${String(uid).slice(-4).toUpperCase()}`;
}

function buildProfile(user) {
  const providerId = user.providerData?.[0]?.providerId || user.providerId || "anonymous";
  const photoURL = user.photoURL || user.providerData?.[0]?.photoURL || "";
  const name =
    user.displayName ||
    user.providerData?.[0]?.displayName ||
    (providerId === "anonymous" ? shortGuestName(user.uid) : `مستخدم ${String(user.uid).slice(-4).toUpperCase()}`);

  return {
    uid: user.uid,
    name,
    photoURL,
    providerId,
  };
}

function notifyAuthListeners() {
  const payload = {
    user: currentUser,
    profile: { ...currentProfile },
  };

  authListeners.forEach((callback) => {
    try {
      callback(payload);
    } catch (error) {
      console.error("Auth listener error:", error);
    }
  });
}

function clearHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

async function upsertUserDoc(user, profile) {
  const ref = doc(db, USERS_COL, user.uid);

  await setDoc(
    ref,
    {
      uid: user.uid,
      name: profile.name,
      photoURL: profile.photoURL || "",
      providerId: profile.providerId || "anonymous",
      lastSeen: Date.now(),
      updatedAt: serverTimestamp(),
      meta: {
        app: "kareem4",
      },
    },
    { merge: true }
  );
}

async function upsertPresenceDoc(user, profile) {
  const ref = doc(db, PRESENCE_COL, user.uid);

  await setDoc(
    ref,
    {
      uid: user.uid,
      name: profile.name,
      photoURL: profile.photoURL || "",
      providerId: profile.providerId || "anonymous",
      status: "online",
      lastSeen: Date.now(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function markOfflineDoc(user, profile) {
  if (!user) return;

  try {
    await setDoc(
      doc(db, PRESENCE_COL, user.uid),
      {
        uid: user.uid,
        name: profile?.name || currentProfile.name || "زائر",
        photoURL: profile?.photoURL || currentProfile.photoURL || "",
        providerId: profile?.providerId || currentProfile.providerId || "anonymous",
        status: "offline",
        lastSeen: Date.now(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Presence offline write failed:", error);
  }
}

async function ensureAuthSession() {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Anonymous sign-in failed:", error);
    }
  }
}

onAuthStateChanged(auth, async (user) => {
  currentUser = user || null;

  if (user) {
    currentProfile = buildProfile(user);

    try {
      await upsertUserDoc(user, currentProfile);
      await upsertPresenceDoc(user, currentProfile);

      clearHeartbeat();
      heartbeatTimer = setInterval(() => {
        if (currentUser) {
          upsertPresenceDoc(currentUser, currentProfile).catch((error) => {
            console.error("Presence heartbeat error:", error);
          });
        }
      }, 15000);
    } catch (error) {
      console.error("Auth bootstrap error:", error);
    }
  } else {
    clearHeartbeat();
  }

  notifyAuthListeners();

  if (authReadyResolve) {
    authReadyResolve(user);
    authReadyResolve = null;
  }
});

ensureAuthSession();

window.addEventListener("beforeunload", () => {
  if (currentUser) {
    markOfflineDoc(currentUser, currentProfile);
  }
});

export function onAuthChange(callback) {
  authListeners.add(callback);
  callback({
    user: currentUser,
    profile: { ...currentProfile },
  });

  return () => authListeners.delete(callback);
}

export function getCurrentUser() {
  return currentUser;
}

export function getCurrentProfile() {
  return { ...currentProfile };
}

export async function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function logoutUser() {
  if (currentUser) {
    await markOfflineDoc(currentUser, currentProfile);
  }

  await signOut(auth);
  await ensureAuthSession();
}

export function listenPublicMessages(callback) {
  const ref = collection(db, PUBLIC_MESSAGES_COL);

  return onSnapshot(
    ref,
    (snapshot) => {
      const items = [];

      snapshot.forEach((entry) => {
        items.push({
          id: entry.id,
          ...entry.data(),
        });
      });

      callback(items);
    },
    (error) => {
      console.error("Public messages listener error:", error);
      callback([]);
    }
  );
}

export async function sendPublicMessage(text) {
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const cleanText = String(text ?? "").trim();
  if (!cleanText) return null;

  return addDoc(collection(db, PUBLIC_MESSAGES_COL), {
    text: cleanText,
    from: currentUser.uid,
    fromName: currentProfile.name,
    fromPhotoURL: currentProfile.photoURL || "",
    providerId: currentProfile.providerId || "anonymous",
    clientTime: Date.now(),
    createdAt: serverTimestamp(),
    kind: "public",
  });
}

export function listenPresence(callback) {
  const ref = collection(db, PRESENCE_COL);

  return onSnapshot(
    ref,
    (snapshot) => {
      const items = [];

      snapshot.forEach((entry) => {
        items.push({
          id: entry.id,
          ...entry.data(),
        });
      });

      callback(items);
    },
    (error) => {
      console.error("Presence listener error:", error);
      callback([]);
    }
  );
}

function buildThreadId(uidA, uidB) {
  return [uidA, uidB].sort().join("__");
}

export async function sendPrivateMessage(partnerUid, partnerName, partnerPhotoURL, text) {
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const cleanText = String(text ?? "").trim();
  if (!cleanText || !partnerUid) return null;

  const threadId = buildThreadId(currentUser.uid, partnerUid);

  return addDoc(collection(db, PRIVATE_MESSAGES_COL), {
    threadId,
    from: currentUser.uid,
    fromName: currentProfile.name,
    fromPhotoURL: currentProfile.photoURL || "",
    to: partnerUid,
    toName: partnerName || "",
    toPhotoURL: partnerPhotoURL || "",
    participants: [currentUser.uid, partnerUid],
    text: cleanText,
    clientTime: Date.now(),
    createdAt: serverTimestamp(),
    kind: "private",
  });
}

export function listenPrivateMessages(partnerUid, callback) {
  if (!currentUser || !partnerUid) {
    callback([]);
    return () => {};
  }

  const threadId = buildThreadId(currentUser.uid, partnerUid);
  const ref = query(collection(db, PRIVATE_MESSAGES_COL), where("threadId", "==", threadId));

  return onSnapshot(
    ref,
    (snapshot) => {
      const items = [];

      snapshot.forEach((entry) => {
        items.push({
          id: entry.id,
          ...entry.data(),
        });
      });

      callback(items);
    },
    (error) => {
      console.error("Private messages listener error:", error);
      callback([]);
    }
  );
}

export const KAREEM4_DB = {
  auth,
  db,
  authReady,
  getCurrentUser,
  getCurrentProfile,
  onAuthChange,
  loginWithGoogle,
  logoutUser,
  listenPublicMessages,
  sendPublicMessage,
  listenPresence,
  listenPrivateMessages,
  sendPrivateMessage,
};

window.KAREEM4_DB = KAREEM4_DB;
window.KAREEM4_AUTH_READY = authReady;
