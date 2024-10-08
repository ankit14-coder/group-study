const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-message');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});


// Message from server
socket.on('server-message', (message) => {
    console.log(message);
    outputServerMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
//Messages from users
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);


    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;


    // Emit message to server
    socket.emit('chatMessage', msg);


    // Clear input and focus to the input button
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});



// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-message').appendChild(div);
}

function outputServerMessage(message) {
    const div = document.createElement('div');
    div.classList.add('server-message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-message').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}