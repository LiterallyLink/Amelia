const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');


module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Pat a specific user!',
			category: 'Anime',
			usage: '<user>'
		});
	}

	async run(message) {
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who's hand you'd like to pat.");
		}

		const { body } = await request
			.get('https://nekos.life/api/v2/img/pat');

		const pat = new MessageEmbed()
			.setImage(body.url)
			.setDescription(`${user} has been patted by ${message.author}!`)
			.setColor('fce3b7');
		return message.channel.send(pat);
	}

};
