const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Tickle a specific user!',
			category: 'Anime',
			usage: '<user>'
		});
	}

	async run(message) {
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who you'd like to tickle");
		}

		const { body } = await request
			.get('https://nekos.life/api/v2/img/tickle');

		const tickle = new MessageEmbed()
			.setImage(body.url)
			.setDescription(`${message.author} tickled ${user}!`)
			.setColor('fce3b7');
		return message.channel.send(tickle);
	}

};
