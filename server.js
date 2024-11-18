const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/chat/:room', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

io.on('connection', (socket) => {
  console.log('Usuário conectado');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Alguém se conectou à sala ${room}`);
  });

  socket.on('chatMessage', (data) => {
    io.to(data.room).emit('chatMessage', data.message);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
})