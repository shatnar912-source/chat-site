import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCG2tZ86jmtuc_smyyJE4a0mx7V5kgU6Xc",
  authDomain: "shatnar-f2081.firebaseapp.com",
  projectId: "shatnar-f2081",
  storageBucket: "shatnar-f2081.firebasestorage.app",
  messagingSenderId: "237897103941",
  appId: "1:237897103941:web:989dcd6cae6bc7e84d012c",
  measurementId: "G-HVNTN7FGH4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const messagesRef = collection(db, "public_messages");

export async function sendMessage(text) {
  await addDoc(messagesRef, {
    text,
    time: Date.now()
  });
}

export function listenMessages(callback) {
  const q = query(messagesRef, orderBy("time"));

  onSnapshot(q, (snap) => {
    const msgs = [];
    snap.forEach(d => msgs.push(d.data()));
    callback(msgs);
  });
}
