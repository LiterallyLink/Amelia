const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const GuildSchema = require('../../Models/guildSchema');

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

		if (!target) {
			return message.channel.send(new MessageEmbed().setDescription(`Please mention a valid user.\n** **\nYou have ${userBal} credits`).setColor('RED'));
		}

		const userBal = await this.client.economy.getCredits(message.guild.id, message.author.id);
		await this.client.economy.getCredits(message.guild.id, target.id);
		const payment = args[1];

		const economyModule = await GuildSchema.findOne({ guildID: message.guild.id });

		if (!economyModule.eco) {
			return message.channel.send(`The economy module is currently disabled.`);
		}

		if (!this.client.utils.isWhole(payment)) {
			return message.channel.send(new MessageEmbed().setDescription(`Please provide a valid number of credit`).setColor('fce3b7'));
		} else if (payment > userBal) {
			return message.channel.send(new MessageEmbed().setDescription(`You don't have enough credits to pay this user.\n** **\nYou have ${userBal} credits`).setColor('RED'));
		}

		const targetBal = await this.client.economy.addCredits(message.guild.id, target.id, payment);
		const newUserBal = await this.client.economy.addCredits(message.guild.id, message.author.id, -payment);

		const successEmbed = new MessageEmbed()
			.setTitle('Transaction Successful')
			.setDescription(`From: ${message.author}, To: ${target}, Amount: ${payment}`)
			.addFields(
				{
					name: 'You have:',
					value: `${newUserBal} credits`
				},
				{
					name: `${target.username} has:`,
					value: `${targetBal} credits`
				})
			.setColor('fce3b7');

		return message.channel.send(successEmbed);
	}

};
