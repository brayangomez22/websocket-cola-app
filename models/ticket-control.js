const path = require('path');
const fs = require('fs');

class Ticket {
	constructor(number, desk) {
		this.number = number;
		this.desk = desk;
	}
}

class TicketControl {
	constructor() {
		this.latest = 0;
		this.today = new Date().getDate();
		this.tickets = [];
		this.lastFourTickets = [];

		this.init();
	}

	get toJSON() {
		return {
			latest: this.latest,
			today: this.today,
			tickets: this.tickets,
			lastFourTickets: this.lastFourTickets,
		};
	}

	init() {
		const { latest, today, tickets, lastFourTickets } = require('../db/data.json');

		if (today === this.today) {
			this.latest = latest;
			(this.tickets = tickets), (this.lastFourTickets = lastFourTickets);
		} else {
			this.saveDB();
		}
	}

	saveDB() {
		const pathDB = path.join(__dirname, '../db/data.json');
		fs.writeFileSync(pathDB, JSON.stringify(this.toJSON));
	}

	next() {
		this.latest += 1;
		const ticket = new Ticket(this.latest, null);
		this.tickets.push(ticket);

		this.saveDB();

		return 'Ticket ' + ticket.number;
	}

	attendTicket(desk) {
		if (this.tickets.length === 0) {
			return null;
		}

		const ticket = this.tickets.shift();
		ticket.desk = desk;

		this.lastFourTickets.unshift(ticket);

		if (this.lastFourTickets.length > 4) {
			this.lastFourTickets.splice(-1, 1);
		}

		this.saveDB();

		return ticket;
	}
}

module.exports = TicketControl;
