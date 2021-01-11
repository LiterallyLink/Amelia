const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Shuffles the current queue',
			category: 'Music',
			guildOnly: true
		});
	}

	async run(message) {
		if (!this.client.utils.canModifyQueue(message.member)) return;

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {
			message.channel.send(new MessageEmbed()
				.setDescription('The server queue is currently empty')
				.setColor('fce3b7'));
			return;
		}

		const { songs } = serverQueue;

		for (let i = songs.length - 1; i > 1; i--) {
			const j = 1 + Math.floor(Math.random() * i);
			[songs[i], songs[j]] = [songs[j], songs[i]];
		}

		serverQueue.songs = songs;
		message.client.queue.set(message.guild.id, serverQueue);

		message.channel.send(new MessageEmbed()
			.setDescription('Shuffled the queue')
			.setColor('fce3b7'));
		return;
	}

};
