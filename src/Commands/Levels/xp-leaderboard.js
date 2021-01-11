const Command = require('../../Structures/Command');
const Levels = require('discord-xp');
const { MessageEmbed } = require('discord.js');
const GuildSchema = require('../../Models/guildSchema.js');
const mongoURL = require('../../../config.json');
Levels.setURL(mongoURL.mongoPath);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['xplb'],
			description: 'Displays the guild leaderboard',
			category: 'Levels',
			guildOnly: true
		});
	}

	async run(message) {
		const xpModule = await GuildSchema.findOne({ guildID: message.guild.id });

		if (!xpModule.xp) {
			return message.channel.send(new MessageEmbed().setDescription(`The XP-Module is currently disabled.`).setFooter('Use the xp-module command to enable XP.').setColor('fce3b7'));
		}

		const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);
		if (rawLeaderboard.length < 1) {
			return message.channel.send(new MessageEmbed().setAuthor(`${message.guild.name} server's leaderboard`).setDescription('No data to display'));
		}

		const leaderboard = await Levels.computeLeaderboard(this.client, rawLeaderboard, true);
		const lb = leaderboard.map(exp => `${exp.position}. <@${exp.userID}> ${exp.xp.toLocaleString()} XP - Level ${exp.level}`);

		return message.channel.send(new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL()).setTitle(`Leaderboard:`).setDescription(`${lb.join('\n\n')}`).setColor('fce3b7'));
	}

};
