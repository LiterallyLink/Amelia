const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Provides the queue for the server',
			category: 'Music',
			guildOnly: true
		});
	}

	async run(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		const queueEmbed = new MessageEmbed()
			.setColor('fce3b7');

		if (!serverQueue) {
			return message.channel.send(new MessageEmbed().setDescription('The server queue is currently empty').setColor('RED'));
		}

		return message.channel.send(queueEmbed.setDescription(`__**Song queue:**__${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}**Now playing:** ${serverQueue.songs[0].title}`));
	}

};
