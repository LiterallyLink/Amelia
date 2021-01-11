const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Skip to a specific song in the queue',
			category: 'Music',
			guildOnly: true
		});
	}

	async run(message, args) {
		if (!this.client.utils.canModifyQueue(message.member)) return;

		if (!args.length && isNaN(args[0])) {
			message.channel.send('Please provide a valid track number');
			return;
		}

		const songQueue = message.client.queue.get(message.guild.id);

		if (!songQueue) {
			message.channel.send('There is currently nothing in the queue');
			return;
		}

		if (args[0] > songQueue.songs.length) {
			message.channel.send(new MessageEmbed()
				.setDescription(`Please provide a valid track number`)
				.setFooter(`The queue is currently ${songQueue.songs.length} songs long`)
				.setColor('fce3b7'));
			return;
		}

		songQueue.playing = true;

		if (songQueue.loop) {
			for (let i = 0; i < args[0] - 1; i++) { songQueue.songs.push(songQueue.songs.shift()); }
		} else {
			songQueue.songs = songQueue.songs.slice(args[0] - 1);
		}

		songQueue.connection.dispatcher.end();
		message.channel.send(new MessageEmbed()
			.setAuthor(`Skipped to position ${args[0]} of the queue`, message.author.displayAvatarURL())
			.setColor('fce3b7'));
		return;
	}

};
