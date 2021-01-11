/* eslint-disable consistent-return */
const Command = require('../../Structures/Command');
const Levels = require('discord-xp');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const canvacord = require('canvacord');
const GuildSchema = require('../../Models/guildSchema.js');
const mongoURL = require('../../../config.json');
Levels.setURL(mongoURL.mongoPath);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Returns the rank of a specified user',
			category: 'Levels',
			usage: '<user>',
			guildOnly: true
		});
	}

	async run(message, [target]) {
		const xpModule = await GuildSchema.findOne({ guildID: message.guild.id });

		if (!xpModule.xp) {
			return message.channel.send(new MessageEmbed().setDescription(`The XP-Module is currently disabled.`).setFooter('Use the xp-module command to enable XP.').setColor('fce3b7'));
		}

		const member = this.client.utils.getMember(message, target);
		const user = await Levels.fetch(member.id, message.guild.id);
		const neededXp = Levels.xpFor(parseInt(user ? user.level : 0) + 1);
		const rank = await Levels.fetchRank(member.id, message.guild.id);

		if (!user) {
			return message.channel.send(new MessageEmbed().setDescription("You aren't ranked yet. Send some messages first, then try again.").setColor('fce3b7'));
		}

		const rankCard = new canvacord.Rank()
			.setAvatar(member.user.displayAvatarURL({ dynamic: false, format: 'png' }))
			.setCurrentXP(user.xp)
			.setLevel(user.level)
			.setRank(rank)
			.setRequiredXP(neededXp)
			.setStatus(message.member.presence.status)
			.setProgressBar('#fce3b7', 'COLOR')
			.setUsername(member.user.username)
			.setDiscriminator(member.user.discriminator);

		rankCard.build()
			.then(data => {
				const attachment = new Discord.MessageAttachment(data, 'RankCard.png');
				return message.channel.send(attachment);
			});
	}

};

