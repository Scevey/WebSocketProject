const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');
const htmlHandler = require('./htmlResponses.js');
const draw = require('./drawerLogic.js');
const choose = require('./chooserLogic.js');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;
// tell your server to listen on the port

const handler = (req, res) => {
    console.log(request.url);
  switch (request.url) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/drawer':
       htmlHandler.getDrawer(request, response);
      break;
    case '/chooser':
       htmlHandler.getChooser(request, response);
      break;
	case '/chooser':
       htmlHandler.getViewer(request, response);
      break;
    default:
      htmlHandler.getIndex(request, response);
      break;
  }
};

const app = http.createServer(handler);
const io = socketio(app);
app.listen(PORT);

const userScores = {};
let totalScore = 0;
let drawList = {};
let usercount = 0;

io.on('connection', (socket) => {
  socket.join('room1');

  socket.on('draw', (data) => {
    drawList[data.time] = data.coords;
    io.sockets.in('room1').emit('draw', drawList);
  });

  // check if first user
  socket.on('check', () => {
    usercount++;
    if (usercount === 1) {
      socket.emit('start');
    } else {
      io.sockets.in('room1').emit('draw', drawList);
    }
  });

  // update a users score
  socket.on('score', (data) => {
    userScores[data.name] = data.score;
  });

  // handle click event
  socket.on('click', (data) => {
    drawList[data.key].color = data.color;
    userScores[data.color] += 1;
    totalScore += 1;
    io.sockets.in('room1').emit('draw', drawList);
    socket.emit('updateScore', { score: userScores[data.color], total: totalScore });
  });

  // reset data
  socket.on('reset', () => {
    drawList = {};
    usercount = 0;
    totalScore = 0;
    const keys = Object.keys(userScores);
    for (let i = 0; i < keys.length; i++) {
      userScores[keys[i]] = 0;
    }
    socket.emit('start');
    io.sockets.in('room1').emit('draw', drawList);
    io.sockets.in('room1').emit('scorereset');
  });
  // display win color
  socket.on('win', (data) => {
    const colorName = data;
    io.sockets.in('room1').emit('win', colorName);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log(`listening on port ${PORT}`);
