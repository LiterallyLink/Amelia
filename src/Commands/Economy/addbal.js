const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Add credits to a users balance.',
			category: 'Economy',
			usage: '<user> <credits>',
			userPerms: ['MANAGE_GUILD'],
			guildOnly: true,
			args: true
		});
	}

	async run(message, args) {
		const target = message.mentions.users.first();
		const credits = args[1];

		if (!target.id) {
			return message.channel.send(new MessageEmbed().setDescription(`Please mention a valid user.`).setColor('RED'));
		}

		if (!this.client.utils.isWhole(credits)) {
			return message.channel.send(new MessageEmbed().setDescription(`Please provide a valid number of credits`).setColor('fce3b7'));
		}

		await this.client.economy.getCredits(message.guild.id, target.id);
		const newBalance = await this.client.economy.addCredits(message.guild.id, target.id, credits);
		return message.channel.send(new MessageEmbed().setDescription(`Added ${credits} credits to ${target}'s balance.\n** **\nNew Balance: ${newBalance}`).setColor('fce3b7'));
	}

};
