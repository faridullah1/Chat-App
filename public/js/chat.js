const socket = io();

// Elements
const $sendBtn = document.querySelector('#btnSend');
const $sendLocationBtn = document.querySelector('#btnSendLocation');
const $messageField = document.querySelector('#messageField');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#messageTemplate').innerHTML;
const locationTemplate = document.querySelector('#locationTemplate').innerHTML;

socket.on('message', (message) => {
	console.log('new Message =>', message);
	const html = Mustache.render(messageTemplate, {
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a')
	});
	$messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (location) => {
	console.log('location =', location);
	const html = Mustache.render(locationTemplate, {
		url: location.url,
		createdAt: moment(location.createdAt).format('h:mm a')
	});
	$messages.insertAdjacentHTML('beforeend', html);
})

// Click event listeners;
$sendBtn.addEventListener('click', () => {
	$sendBtn.setAttribute('disabled', 'disabled');

	const message = $messageField.value;

	socket.emit('sendMessage', message, (error) => {
		$sendBtn.removeAttribute('disabled');
		$messageField.value = '';
		$messageField.focus();

		if (error) return console.error(error);

		console.log('Message Delivered!')
	});
});

$sendLocationBtn.addEventListener('click', () => {
	if (!navigator.geolocation) {
		return window.alert('GeoLocation is not supported by your browser!');
	}

	$sendLocationBtn.setAttribute('disabled', 'disabled');

	navigator.geolocation.getCurrentPosition((positions) => {
		const location = {
			latitude: positions.coords.latitude,
			longitude: positions.coords.longitude,
		};

		socket.emit('sendLocation', location, () => {
			$sendLocationBtn.removeAttribute('disabled');
		});
	});
});