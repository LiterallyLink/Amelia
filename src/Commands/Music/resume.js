const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Resumes the queue',
			category: 'Music',
			guildOnly: true
		});
	}

	async run(message) {
		if (!this.client.utils.canModifyQueue(message.member)) return;

		const serverQueue = message.client.queue.get(message.guild.id);

		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			message.channel.send('▶ Resumed the music');
			return;
		}

		message.channel.send('The queue is not paused.');
		return;
	}

};
