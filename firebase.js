// firebase.js

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 config بتاعك
const firebaseConfig = {
  apiKey: "AIzaSyCG2tZ86jmtuc_smyyJE4a0mx7V5kgU6Xc",
  authDomain: "shatnar-f2081.firebaseapp.com",
  projectId: "shatnar-f2081",
  storageBucket: "shatnar-f2081.firebasestorage.app",
  messagingSenderId: "237897103941",
  appId: "1:237897103941:web:989dcd6cae6bc7e84d012c",
  measurementId: "G-HVNTN7FGH4"
};

// 🧠 تشغيل Firebase مرة واحدة بس
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🗄️ Firestore
const db = getFirestore(app);

// 📂 Collections
const publicMessagesRef = collection(db, "public_messages");
const usersOnlineRef = collection(db, "users_online");
const featuredUsersRef = collection(db, "featured_users");

// 🧪 حالة النظام (عشان لوحة الأدمن)
window.KAREEM3_STATUS = window.KAREEM3_STATUS || {};
window.KAREEM3_STATUS.firebase = true;

// 📤 Export
export {
  db,
  publicMessagesRef,
  usersOnlineRef,
  featuredUsersRef,
  addDoc,
  setDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
};
