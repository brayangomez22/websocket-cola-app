const lblNewTicket = document.getElementById('lblNewTicket');
const createBtn = document.getElementById('createBtn');

const socket = io();

socket.on('connect', () => {
	createBtn.disabled = false;
});

socket.on('disconnect', () => {
	createBtn.disabled = true;
});

socket.on('latest-ticket', (payload) => {
	lblNewTicket.innerText = `Ticket ${payload}`;
});

createBtn.addEventListener('click', () => {
	socket.emit('next-ticket', null, (ticket) => {
		lblNewTicket.innerText = ticket;
	});
});
