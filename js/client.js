const socket = io('http://localhost:8000');

// Get DOM elements in the respective js variables.
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio which will play upon receiving messages.
var audio = new Audio('ting.mp3');

// Function which will append event info to the container.
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

// Ask new user for his/her name and let the server know
// const name = prompt("Enter your name to join:");
// socket.emit('new-user-joined', name);
let name;
do {
    name = prompt("Enter your name to join:");
} while (!name || name.charAt(0) == " ");
socket.emit('new-user-joined', name);
callOnJoin();

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name => {
    // append(`${name} joined the chat.`, 'right');
    append(`${name} joined the chat.`, 'center');
})

// If server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
})

// If a user leaves the chat, append the info to the container
socket.on('left', name => {
    // append(`${name} left the chat.`, 'right');
    append(`${name} left the chat.`, 'center');
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
    
    document.getElementById('button').disabled = true;
})

function callOnJoin() {
    // append(`You joined the chat.`, 'right');
    append(`You joined the chat.`, 'center');
}

function success() {
    if (document.getElementById("messageInp").value === "") {
        document.getElementById('button').disabled = true;
    }
    else if (document.getElementById("messageInp").value.charAt(0) === " " || document.getElementById("messageInp").value.charAt(0) === "\n") {
        document.getElementById('button').disabled = true;
        alert("This message cannot be sent. Please follow the rules mentioned below.\n\nRules for drafting a chat message:\n1. A message cannot be blank.\n2. A message cannot start with a blank space.\n3. A message cannot start with an enter character.");
    }
    else {
        document.getElementById('button').disabled = false;
    }
}

// function warning() {
//     if (document.getElementById('button').disabled) {
//         alert("Message cannot be blank.");
//     }
// }