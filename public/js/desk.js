const h1Desk = document.querySelector('h1');
const attendBtn = document.getElementById('attendBtn');
const lblTicket = document.getElementById('lblTicket');
const alertDom = document.getElementById('alertDom');
const lblPending = document.getElementById('lblPending');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('desk')) {
	window.location = 'index.html';
	throw new Error('Desk is required');
}

const desk = searchParams.get('desk');
h1Desk.innerText = desk;

alertDom.style.display = 'none';

const socket = io();

socket.on('connect', () => {
	attendBtn.disabled = false;
});

socket.on('disconnect', () => {
	attendBtn.disabled = true;
});

attendBtn.addEventListener('click', () => {
	socket.emit('attend-ticket', { desk }, ({ ok, ticket, msg }) => {
		if (!ok) {
			lblTicket.innerText = 'to the ghosts';
			return (alertDom.style.display = '');
		}

		lblTicket.innerText = `Ticket ${ticket.number}`;
	});
});

socket.on('pending-tickets', (payload) => {
	if (payload === 0) {
		alertDom.style.display = '';
		lblPending.style.display = 'none';
	} else {
		alertDom.style.display = 'none';
		lblPending.style.display = '';
		lblPending.innerText = payload;
	}
});
