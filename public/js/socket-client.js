const online = document.getElementById('online');
const offline = document.getElementById('offline');
const txtMessage = document.getElementById('txtMessage');
const btnSubmit = document.getElementById('btnSubmit');

const socket = io();

socket.on('connect', () => {
	online.style.display = '';
	offline.style.display = 'none';
});

socket.on('disconnect', () => {
	online.style.display = 'none';
	offline.style.display = '';
});

socket.on('send-message', (payload) => {
	console.log(payload);
});

btnSubmit.addEventListener('click', () => {
	const message = txtMessage.value;
	const payload = {
		message,
		id: '122',
		date: new Date().getTime(),
	};

	socket.emit('send-message', payload, (id) => {
		console.log('Server', id);
	});
});
