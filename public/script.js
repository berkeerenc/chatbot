// Sohbet geçmişi ve aktif sohbet yönetimi
let chats = JSON.parse(localStorage.getItem('chats')) || [];
let activeChatId = chats.length > 0 ? chats[0].id : null;

const chatWindow = document.getElementById('chat-window');
const chatHistoryList = document.getElementById('chat-history');
const newChatBtn = document.getElementById('new-chat');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');

function saveChats() {
  localStorage.setItem('chats', JSON.stringify(chats));
}

function createChat() {
  const id = Date.now().toString();
  const newChat = { id, title: 'Yeni Sohbet', messages: [] };
  chats.unshift(newChat);
  activeChatId = id;
  saveChats();
  renderChatHistory();
  renderActiveChat();
}

function setActiveChat(id) {
  activeChatId = id;
  renderChatHistory();
  renderActiveChat();
}

function renderChatHistory() {
  chatHistoryList.innerHTML = '';
  chats.forEach(chat => {
    const li = document.createElement('li');
    li.textContent = chat.title;
    li.className = chat.id === activeChatId ? 'active' : '';
    li.onclick = () => setActiveChat(chat.id);
    chatHistoryList.appendChild(li);
  });
}

function renderActiveChat() {
  chatWindow.innerHTML = '';
  const chat = chats.find(c => c.id === activeChatId);
  if (!chat) return;
  chat.messages.forEach(msg => {
    appendMessage(msg.sender, msg.text, false);
  });
}

function appendMessage(sender, text, save = true) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  if (save) {
    const chat = chats.find(c => c.id === activeChatId);
    if (chat) {
      chat.messages.push({ sender, text });
      // Başlık güncelle (ilk kullanıcı mesajı)
      if (chat.title === 'Yeni Sohbet' && sender === 'user') {
        chat.title = text.length > 20 ? text.slice(0, 20) + '...' : text;
        renderChatHistory();
      }
      saveChats();
    }
  }
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage('user', message);
  userInput.value = '';

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    appendMessage('bot', data.reply);
  } catch (err) {
    console.error(err);
    appendMessage('bot', '❌ Error: Failed to fetch response.');
  }
});

newChatBtn.addEventListener('click', () => {
  createChat();
  userInput.focus();
});

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  document.body.classList.toggle('menu-open', !sidebar.classList.contains('collapsed'));
});

// İlk yüklemede sohbet geçmişini ve aktif sohbeti göster
if (chats.length === 0) {
  createChat();
} else {
  renderChatHistory();
  renderActiveChat();
}

// Sayfa ilk açıldığında sidebar'ın durumuna göre body'ye menu-open class'ı ekle
if (!sidebar.classList.contains('collapsed')) {
  document.body.classList.add('menu-open');
} else {
  document.body.classList.remove('menu-open');
}
