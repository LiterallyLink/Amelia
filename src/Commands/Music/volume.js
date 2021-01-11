const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Adjusts the volume',
			category: 'Music',
			guildOnly: true
		});
	}

	async run(message, [volume]) {
		const { channel } = message.member.voice;

		if (!channel) {
			message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
			return;
		}

		if (!this.client.utils.canModifyQueue(message.member)) return;

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {
			message.channel.send('There is nothing playing.');
			return;
		}

		if (!volume && isNaN(volume)) {
			message.channel.send(`The current volume is: **${serverQueue.volume}**`);
			return;
		}
		serverQueue.volume = volume;
		serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 5);
		message.channel.send(`The volume has been set to: **${volume}**`);
		return;
	}

};
