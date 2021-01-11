const Command = require('../../Structures/Command');
const Levels = require('discord-xp');
const { MessageEmbed } = require('discord.js');
const GuildSchema = require('../../Models/guildSchema.js');
const mongoURL = require('../../../config.json');
Levels.setURL(mongoURL.mongoPath);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Set a specific users level',
			category: 'Levels',
			usage: '<user> <level>',
			userPerms: ['ADMINISTRATOR'],
			args: true,
			guildOnly: true
		});
	}

	async run(message, args) {
		const target = message.mentions.users.first() || message.author;
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

		Levels.setLevel(target.id, message.guild.id, args[1]);
		return message.channel.send(new MessageEmbed().setDescription(`Set ${args[0]}'s level to ${args[1]}`).setColor('fce3b7'));
	}

};
