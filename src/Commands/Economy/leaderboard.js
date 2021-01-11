const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const GuildSchema = require('../../Models/guildSchema');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Displays the server economy leaderboard',
			category: 'Economy',
			guildOnly: true
		});
	}

	async run(message) {
		const economyModule = await GuildSchema.findOne({ guildID: message.guild.id });

		if (economyModule.eco === false) {
			return message.channel.send(`The economy module is currently disabled.`);
		}

		const rawLeaderboard = await this.client.economy.fetchLeaderboard(message.guild.id, 10);

		if (rawLeaderboard.length < 1) {
			return message.channel.send(new MessageEmbed().setAuthor(`${message.guild.name} server's leaderboard`).setDescription('No data to display'));
		}

		const lb = rawLeaderboard.map(currencyBoard => `<@${currencyBoard.userId}> ${this.client.utils.formatNumber(currencyBoard.credits)} total credits`);

		return message.channel.send(new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL()).setTitle(`Leaderboard:`).setDescription(`${lb.join('\n\n')}`).setColor('fce3b7'));
	}

};
