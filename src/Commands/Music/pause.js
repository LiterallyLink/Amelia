const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Pauses the current song',
			category: 'Music',
			guildOnly: true
		});
	}

	async run(message) {
		if (!this.client.utils.canModifyQueue(message.member)) return;

		const serverQueue = message.client.queue.get(message.guild.id);

		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause(true);
			message.channel.send('⏸ Paused the music for you!');
			return;
		}

		message.channel.send(new MessageEmbed()
			.setDescription('There is currently nothing playing.')
			.setColor('fce3b7'));
		return;
	}

};
