/* eslint-disable consistent-return */
/* eslint-disable new-cap */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const GuildSchema = require('../../Models/guildSchema.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Set the server prefix',
			category: 'Utilities',
			userPerms: 'MANAGE_GUILD',
			usage: '!',
			guildOnly: true
		});
	}

	async run(message, [newPrefix]) {
		const embed = new MessageEmbed();
		const settings = await GuildSchema.findOne({ guildID: message.guild.id });

		if (!newPrefix || newPrefix.length > 2) {
			return message.channel.send(embed.setColor('RED').setDescription('Please provide a valid prefix.').setFooter('Prefixes can be a maximum of 2 characters.'));
		}

		await settings.updateOne({
			prefix: newPrefix

		});

		return message.channel.send(embed.setColor('fce3b7').setDescription(`The server prefix has been updated to ${newPrefix}`));
	}

};
