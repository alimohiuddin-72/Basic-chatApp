document.addEventListener('DOMContentLoaded', () => {
  const socket = io()
  const messageContainer = document.getElementById('message-container')
  const messageForm = document.getElementById('send-container')
  const messageInput = document.getElementById('message-input')

  let name = null
  try {
    name = prompt('What is your name?')
  } catch (e) {
    name = null
  }
  if (!name || !name.trim()) {
    name = 'User' + Math.floor(Math.random() * 10000)
  }

  appendMessage('You joined')
  socket.emit('new-user', name)

  socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
  })

  socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
  })

  socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`)
  })

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    if (!message || !message.trim()) return
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
  })

  function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
    // keep the latest message visible
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
})