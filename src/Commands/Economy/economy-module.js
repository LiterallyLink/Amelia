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
			aliases: ['eco'],
			description: 'Toggles the economy module',
			category: 'Economy',
			usage: '[enable], economy-module [disable]',
			userPerms: ['ADMINISTRATOR'],
			guildOnly: true
		});
	}

	async run(message, args) {
		try {
			const economyModule = await GuildSchema.findOne({ guildID: message.guild.id });

			if (!args[0] || !input.includes(args[0])) {
				return message.channel.send(new MessageEmbed().setDescription(`Economy is currently ${economyModule.eco ? 'enabled' : 'disabled'} on this server.`).setColor('fce3b7'));
			}

			if (args[0].toLowerCase() === 'enable') {
				await GuildSchema.updateOne({
					eco: true
				});

				return message.channel.send(new MessageEmbed().setDescription('The economy module is now enabled.').setColor('GREEN'));
			} else if (args[0].toLowerCase() === 'disable') {
				await GuildSchema.updateOne({
					eco: false
				});

				return message.channel.send(new MessageEmbed().setDescription('The economy module has been disabled.').setColor('RED'));
			}
		} catch (err) {
			return message.channel.send(new MessageEmbed().setDescription('There was an error updating the database module.\nPlease try again.').setColor('RED'));
		}
	}

};
