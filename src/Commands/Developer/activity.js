/* eslint-disable consistent-return */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['status'],
			description: "Set's the bot's activity",
			category: 'Developer',
			usage: '<statustype> <activity>',
			ownerOnly: true
		});
	}

	async run(message, args) {
		const activity = args[0];
		const status = args.slice(1).join(' ');

		if (!activity || !status || status.length >= 128) {
			const err = new MessageEmbed();
			return message.channel.send(err.setTitle('Activity Types:').setColor('fce3b7').setDescription('PLAYING\nSTREAMING\nLISTENING\nWATCHING\nCOMPETING'));
		}

		if (activity.toUpperCase() === 'STREAMING') {
			const givenURL = args.pop();
			const streamStatus = args.slice(1).join(' ');
			return this.client.user.setActivity(`${streamStatus}`, { type: 'STREAMING', url: `${givenURL}` });
		}

		this.client.user.setActivity(`${status}`, { type: `${activity.toUpperCase()}` });
		const embed = new MessageEmbed()
			.setDescription(`Successefully set status to '${status}'`)
			.setColor('fce3b7');
		return message.channel.send(embed);
	}

};
