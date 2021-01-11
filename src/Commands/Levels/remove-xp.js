const Command = require('../../Structures/Command');
const Levels = require('discord-xp');
const { MessageEmbed } = require('discord.js');
const GuildSchema = require('../../Models/guildSchema.js');
const mongoURL = require('../../../config.json');
Levels.setURL(mongoURL.mongoPath);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Distribute XP to anyone in the server',
			category: 'Levels',
			usage: '<user> <amount>',
			userPerms: ['ADMINISTRATOR'],
			args: true,
			guildOnly: true
		});
	}

	async run(message, args) {
		const target = message.mentions.users.first();
		const xpModule = await GuildSchema.findOne({ guildID: message.guild.id });

		if (!xpModule.xp) {
			return message.channel.send(new MessageEmbed().setDescription(`The XP-Module is currently disabled.`).setFooter('Use the xp-module command to enable XP.').setColor('fce3b7'));
		}

		if (!target.id) {
			return message.channel.send(new MessageEmbed().setDescription(`Please mention a valid user.`).setColor('RED'));
		}

		if (!this.client.utils.isWhole(args[1])) {
			return message.channel.send(new MessageEmbed().setDescription(`Please provide a valid integer`).setColor('fce3b7'));
		}

		Levels.appendXp(target.id, message.guild.id, -args[1]);
		return message.channel.send(new MessageEmbed().setDescription(`Revoked ${args[1]} XP from ${args[0]}`).setColor('fce3b7'));
	}

};
