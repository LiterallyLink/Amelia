const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Fetches Amelia\'s current uptime.',
			category: 'Utilities'
		});
	}

	async run(message) {
		const time = moment.duration(message.client.uptime);
		const days = time.days() === 1 ? `${time.days()} day` : `${time.days()} days`;
		const hours = time.hours() === 1 ? `${time.hours()} hour` : `${time.hours()} hours`;
		const minutes = time.minutes() === 1 ? `${time.minutes()} minute` : `${time.minutes()} minutes`;
		const seconds = time.seconds() === 1 ? `${time.seconds()} second` : `${time.seconds()} seconds`;
		const date = moment().subtract(time, 'ms').format('dddd, MMMM Do YYYY');
		const embed = new MessageEmbed()
			.setTitle('Amelia\'s Uptime')
			.setDescription(`\`\`\`prolog\n${days}, ${hours}, ${minutes}, and ${seconds}\`\`\``)
			.addField('Date Launched', date)
			.setColor('fce3b7');
		message.channel.send(embed);
	}

};
