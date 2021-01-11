const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Skips the current song',
			category: 'Music',
			guildOnly: true
		});
	}

	async run(message) {
		const { channel } = message.member.voice;

		if (!channel) {
			message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
			return;
		}

		if (!this.client.utils.canModifyQueue(message.member)) return;

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {
			message.channel.send('There is nothing playing that I could skip for you.');
			return;
		}

		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return;
	}

};
