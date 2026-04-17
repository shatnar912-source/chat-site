// firebase.js (Full Ready - Kareem 3 Test)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// =====================
// Firebase Config
// =====================
const firebaseConfig = {
  apiKey: "AIzaSyCG2tZ86jmtuc_smyyJE4a0mx7V5kgU6Xc",
  authDomain: "shatnar-f2081.firebaseapp.com",
  projectId: "shatnar-f2081",
  storageBucket: "shatnar-f2081.firebasestorage.app",
  messagingSenderId: "237897103941",
  appId: "1:237897103941:web:989dcd6cae6bc7e84d012c",
  measurementId: "G-HVNTN7FGH4"
};

// =====================
// Init Firebase
// =====================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =====================
// Collection
// =====================
const messagesRef = collection(db, "public_messages");

// =====================
// Send Message
// =====================
async function sendMessage(text) {
  try {
    await addDoc(messagesRef, {
      text: text,
      time: Date.now()
    });
  } catch (err) {
    console.error("Send Error:", err);
  }
}

// =====================
// Listen Messages (Real-time)
// =====================
function listenMessages(callback) {
  const q = query(messagesRef, orderBy("time"));

  onSnapshot(q, (snapshot) => {
    const messages = [];

    snapshot.forEach((doc) => {
      messages.push(doc.data());
    });

    callback(messages);
  });
}

// =====================
// Export
// =====================
export { sendMessage, listenMessages };
