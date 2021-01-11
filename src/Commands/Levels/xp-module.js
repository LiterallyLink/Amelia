/* eslint-disable consistent-return */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const GuildSchema = require('../../Models/guildSchema.js');

const input = [
	'enable',
	'disable'
];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Toggles the xp module',
			aliases: ['xp'],
			category: 'Levels',
			usage: '[enable], xp-module [disable]',
			userPerms: ['ADMINISTRATOR'],
			guildOnly: true
		});
	}

	async run(message, args) {
		try {
			const xpModule = await GuildSchema.findOne({ guildID: message.guild.id });

			if (!args[0] || !input.includes(args[0])) {
				return message.channel.send(new MessageEmbed().setDescription(`XP-Module Status ${xpModule.xp ? '```css\nEnabled```' : '```diff\n- Disabled```'}`).setColor('fce3b7'));
			}

			if (args[0].toLowerCase() === 'enable') {
				await GuildSchema.updateOne({
					xp: true
				});

				return message.channel.send(new MessageEmbed().setDescription('XP-Module ```css\nEnabled```').setColor('GREEN'));
			} else if (args[0].toLowerCase() === 'disable') {
				await GuildSchema.updateOne({
					xp: false
				});

				return message.channel.send(new MessageEmbed().setDescription('XP-Module ```diff\n- Disabled```').setColor('RED'));
			}
		} catch (err) {
			return message.channel.send(new MessageEmbed().setDescription('There was an error updating the database module.\nPlease try again.').setColor('RED'));
		}
	}

};
