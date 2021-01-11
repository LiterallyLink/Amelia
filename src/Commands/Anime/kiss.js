const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const kiss = require('../../../assets/JSONS/animeGifs.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['smooch'],
			description: 'Kiss a specific user!',
			category: 'Anime',
			usage: '<user>'
		});
	}

	async run(message) {
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who you'd like to kiss");
		}

		const url = kiss.kissGif[Math.floor(Math.random() * kiss.kissGif.length)];

		const kissEmbed = new MessageEmbed()
			.setImage(url)
			.setDescription(`${user} has been kissed by ${message.author}!`)
			.setColor('fce3b7');
		return message.channel.send(kissEmbed);
	}

};
