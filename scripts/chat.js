const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    messageElement.style.opacity = '0';
    chatMessages.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.style.opacity = '1';
    }, 50);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    typingIndicator.style.display = 'block';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        
        showTypingIndicator();

        // Simulate LLM response (replace with actual LLM integration)
        setTimeout(() => {
            hideTypingIndicator();
            addMessage(`You said: ${message}`, false);
        }, 2000);
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Welcome message
setTimeout(() => {
    addMessage("Hello! I am Roman's AI assistant. How can I help you today?", false);
}, 1000);