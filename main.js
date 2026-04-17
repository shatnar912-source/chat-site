import { sendMessage, listenMessages } from "./firebase.js";

const chatBox = document.getElementById("chatBox");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.onclick = () => {
  sidebar.classList.toggle("active");
};

function render(messages) {
  chatBox.innerHTML = "";

  messages.slice(-70).forEach(msg => {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = msg.text;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = async () => {
  if (!msgInput.value.trim()) return;

  await sendMessage(msgInput.value);
  msgInput.value = "";
};

msgInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

listenMessages(render);
