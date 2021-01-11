const Event = require('../../Structures/Event');

module.exports = class extends Event {

	async run(message) {
		this.client.snipes.set(message.channel.id, {
			content: message.content,
			author: message.author,
			image: message.attachments.first() ? message.attachments.first().proxyURL : null,
			date: new Date().toLocaleString('en-GB', { dataStyle: 'full', timeStyle: 'short' })
		});
	}

};
