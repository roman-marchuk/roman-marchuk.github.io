document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('close-info').addEventListener('click', function() {
    document.getElementById('info-panel').classList.add('hidden');
});

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (message) {
        addMessage('User', message);
        // Here you would typically send the message to your AI backend
        // For now, we'll just echo the message
        setTimeout(() => {
            addMessage('AI', `You said: ${message}`);
        }, 1000);
        input.value = '';
    }
}

function addMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('p');
    messageElement.textContent = `${sender}: ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}