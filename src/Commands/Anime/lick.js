const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const lick = require('../../../assets/JSONS/animeGifs.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Lick a specific user!',
			category: 'Anime',
			usage: '@user'
		});
	}

	async run(message) {
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who's hand you'd like to hold");
		}

		const url = lick.lickGif[Math.floor(Math.random() * lick.lickGif.length)];

		const lickedEmbed = new MessageEmbed()
			.setImage(url)
			.setDescription(`${user} was licked by ${message.author}!`)
			.setColor('fce3b7');
		return message.channel.send(lickedEmbed);
	}

};
