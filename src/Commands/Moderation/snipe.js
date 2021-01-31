const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Retrieves the most recent deleted message.',
			category: 'Moderation',
			guildOnly: true
		});
	}

	async run(message) {
		const msg = this.client.snipes.get(message.channel.id);

		if (!msg) {
			return message.channel.send(new MessageEmbed().setColor('RED').setDescription('No messages to retrieve.'));
		}

		const embed = new MessageEmbed()
			.setAuthor(`Sniped Message:`)
			.setColor('fce3b7')
			.setDescription(`${msg.content}\nUser: ${msg.author} | ID: ${msg.author.id}`);
		if (msg.image)embed.setImage(msg.image);
		return message.channel.send(embed);
	}

};
