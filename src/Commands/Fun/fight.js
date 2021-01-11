/* eslint-disable consistent-return */
const Command = require('../../Structures/Command');
const apiKey = require('../../../config.json');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const AmeClient = require('amethyste-api');
const ameApi = new AmeClient(apiKey.AME_API);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			category: 'Fun',
			guildOnly: true
		});
	}

	async run(message, args) {
		try {
			const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
			const canvasType = 	Math.floor(Math.random() * 3) + 1;

			if (!member) {
				return message.channel.send('No user provided.');
			}

			const buffer = await ameApi.generate('vs',
				{ type: canvasType,
					url: `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png?size=256`,
					avatar: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=256`,
					sepia: 'true',
					invert: 'false' });
			const attachment = new MessageAttachment(buffer, `vs.gif`);
			message.channel.send(attachment);
		} catch (err) {
			return message.channel.send(`:x: | Error, Api error`);
		}
	}

};
