const http = require('http');
const socketio = require('socket.io');
// const fs = require('fs');
const htmlHandler = require('./htmlResponses.js');
// const draw = require('./drawerLogic.js');
// const choose = require('./chooserLogic.js');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;
// tell your server to listen on the port

const handler = (request, response) => {
  console.log(request.url);
  switch (request.url) {
    case '/':
      htmlHandler.getDrawer(request, response);
      break;
    case '/drawer':
      htmlHandler.getDrawer(request, response);
      break;
    case '/chooser':
      htmlHandler.getChooser(request, response);
      break;
    default:
      htmlHandler.getIndex(request, response);
      break;
  }
};

const app = http.createServer(handler);
const io = socketio(app);
app.listen(PORT);

const roomImgData = {};
let usercount = 0;
const room = 'room';
const mod = 1;

io.on('connection', (socket) => {
 // if (io.socket.client(room + mod) > 4) {
 //   mod += 1;
 // }
  socket.join(room + mod);


  socket.on('ready', () => {
    usercount++;
    if (usercount === 5) {
      io.sockets.in('room1').emit('start');
    }
  });

  // check if first user
  socket.on('timesUP', () => {
    io.sockets.in('room1').emit('end');
  });

  socket.on('snapshot', (data) => {
    roomImgData[data.playerNum] = roomImgData;
    io.sockets.in('room1').emit('addChoices');
  });


  // reset data
  socket.on('reset', () => {
    io.sockets.in('room1').emit('reset');
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log(`listening on port ${PORT}`);
