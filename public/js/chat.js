const socket = io();

socket.on('message', (message) => {
	console.log('new Message =>', message);
});

// Elements
const $sendBtn = document.querySelector('#btnSend');
const $sendLocationBtn = document.querySelector('#btnSendLocation');
const $messageContainer = document.querySelector('#message');

// Click event listeners;
$sendBtn.addEventListener('click', () => {
	$sendBtn.setAttribute('disabled', 'disabled');

	const message = $messageContainer.value;

	socket.emit('sendMessage', message, (error) => {
		$sendBtn.removeAttribute('disabled');
		$messageContainer.value = '';
		$messageContainer.focus();

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