const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {
	socket.emit('latest-ticket', ticketControl.latest);
	socket.emit('actual-state', ticketControl.lastFourTickets);
	socket.emit('pending-tickets', ticketControl.tickets.length);

	socket.on('next-ticket', (payload, callback) => {
		const next = ticketControl.next();
		callback(next);
		socket.broadcast.emit('pending-tickets', ticketControl.tickets.length);
	});

	socket.on('attend-ticket', ({ desk }, callback) => {
		if (!desk) {
			return callback({
				ok: false,
				msg: 'Desk is required',
			});
		}

		const ticket = ticketControl.attendTicket(desk);

		socket.broadcast.emit('actual-state', ticketControl.lastFourTickets);
		socket.emit('pending-tickets', ticketControl.tickets.length);
		socket.broadcast.emit('pending-tickets', ticketControl.tickets.length);

		if (!ticket) {
			return callback({
				ok: false,
				msg: 'There are no pending tickets',
			});
		} else {
			callback({
				ok: true,
				ticket,
			});
		}
	});
};

module.exports = {
	socketController,
};
