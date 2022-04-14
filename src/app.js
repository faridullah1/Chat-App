const path = require('path');
const http  = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filters = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
	console.log('new Websocket connection');

	socket.emit('message', 'Welcome!');
	socket.broadcast.emit('message', 'A new user has joined!');

	socket.on('sendMessage', (message, callback) => {
		const filter = new Filters();
		if (filter.isProfane(message)) {
			return callback('Profanity is not allowed');
		}

		io.emit('message', message);
		callback();
	});

	socket.on('sendLocation', (location, callback) => {
		io.emit('message', `https://www.google.com/maps?q=${location.latitude},${location.longitude}`);
		callback();
	});

	socket.on('disconnect', () => {
		io.emit('message', 'A user has left!');
	})
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});