const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Pay a specified user',
			category: 'Economy',
			usage: '<user>',
			guildOnly: true,
			args: true
		});
	}

	async run(message, args) {
		const target = message.mentions.users.first();

		if (!target.id) {
			return message.channel.send(new MessageEmbed().setDescription(`Please mention a valid user.`).setColor('RED'));
		}

		await this.client.economy.getCredits(message.guild.id, target.id);
		const credits = args[1];

		if (!this.client.utils.isWhole(args[1])) {
			return message.channel.send(new MessageEmbed().setDescription(`Please provide a valid number of credits`).setColor('fce3b7'));
		}

		await this.client.economy.setCredits(message.guild.id, target.id, credits);
		return message.channel.send(new MessageEmbed().setDescription(`Set ${target}'s balance to ${credits}`).setColor('fce3b7'));
	}

};
