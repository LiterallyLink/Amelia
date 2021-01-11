const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Remove song from the queue',
			category: 'Music',
			guildOnly: true
		});
	}

	async run(message, args) {
		if (!this.client.utils.canModifyQueue(message.member)) return;

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {
			message.channel.send(new MessageEmbed()
				.setDescription('The server queue is currently empty')
				.setColor('RED'));
			return;
		}

		if (!args.length && isNaN(args[0])) {
			message.channel.send('Please provide a valid track number');
			return;
		}

		if (args[0] > serverQueue.songs.length) {
			message.channel.send(new MessageEmbed()
				.setDescription(`Please provide a valid track number`)
				.setFooter(`The queue is currently ${serverQueue.songs.length} songs long`)
				.setColor('fce3b7'));
			return;
		}

		const song = serverQueue.songs.splice(args[0], 1);
		message.channel.send(new MessageEmbed()
			.setDescription(`${message.author} removed **${song[0].title}** from the Queue`)
			.setColor('fce3b7'));
		return;
	}

};
