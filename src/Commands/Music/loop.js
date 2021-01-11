const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['repeat'],
			description: 'Toggle the queue loop',
			category: 'Music',
			guildOnly: true
		});
	}

	async run(message) {
		if (!this.client.utils.canModifyQueue(message.member)) return;

		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) {
			message.channel.send(new MessageEmbed()
				.setDescripion('There is currently nothing in the queue')
				.setColor('RED'));
			return;
		}

		const { channel } = message.member.voice;

		if (!channel) {
			message.channel.send(new MessageEmbed()
				.setDescription('I\'m sorry but you need to be in a voice channel to play music!')
				.setColor('RED'));
			return;
		}

		serverQueue.loop = !serverQueue.loop;
	}

};
