const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Slap a specific user!',
			category: 'Anime',
			usage: '<user>'
		});
	}

	async run(message) {
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who you'd like to slap!");
		}

		const { body } = await request
			.get('https://nekos.life/api/v2/img/slap');

		const slap = new MessageEmbed()
			.setImage(body.url)
			.setDescription(`${message.author} slapped ${user}! Youch!`)
			.setColor('fce3b7');
		return message.channel.send(slap);
	}

};
