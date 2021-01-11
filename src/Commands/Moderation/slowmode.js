/* eslint-disable prefer-destructuring */
const humanizeDuration = require('humanize-duration');
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: "Set's the channel's slowmode time.",
			category: 'Moderation',
			aliases: ['slow'],
			usage: '10 or <channel> 10',
			userPerms: ['MANAGE_CHANNELS'],
			botPerms: ['MANAGE_CHANNELS'],
			guildOnly: true
		});
	}

	async run(message, args) {
		let channel = message.mentions.channels.first();
		const duration = args.pop();
		const currentDuration = new MessageEmbed();

		if (!channel) {
			channel = message.channel;
		}

		if (isNaN(duration)) {
			return message.channel.send(currentDuration.setColor('fce3b7').setDescription(`Channel: ${channel}\nCurrent slowmode: **${humanizeDuration(channel.rateLimitPerUser * 1000)}**`));
		}

		if (channel.type !== 'text' || !channel.viewable) {
			message.channel.send(currentDuration.setColor('fce3b7').setDescription(`Please provide a valid channel.`));
		}

		if (duration >= 21600) {
			return message.channel.send(currentDuration.setColor('fce3b7').setDescription(`Slowmode cannot exceed 6hr's.`));
		}

		channel.setRateLimitPerUser(duration, 'Slowmode command');
		return message.channel.send(currentDuration.setColor('fce3b7').setDescription(`${channel} slowmode has been set to **${humanizeDuration(duration * 1000)}**`));
	}

};
