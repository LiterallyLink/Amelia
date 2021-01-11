const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['dice'],
			description: 'Roll a dice of your choice!',
			category: 'Fun',
			usage: ', !roll <number>',
			guildOnly: true
		});
	}

	async run(message, args) {
		let limit = args[0];
		if (!limit) {
			limit = 6;
		}

		const random = Math.floor(Math.random() * limit) + 1;
		const embed = new MessageEmbed();

		if (!random || limit <= 0 || limit > 999999999999999999999) {
			return message.channel.send(embed.setColor(0xff0000).setDescription('Please provide a valid number.'));
		}

		return message.channel.send(embed.setDescription(`${message.member}, you rolled a **${random} 🎲**!`).setColor('fce3b7'));
	}

};

