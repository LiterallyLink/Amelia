const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const highfive = require('../../../assets/JSONS/animeGifs.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Highfive a specific user!',
			category: 'Anime',
			usage: '@user'
		});
	}

	async run(message) {
		const url = highfive.highfiveGif[Math.floor(Math.random() * highfive.highfiveGif.length)];
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who you'd like to highfive.");
		}

		const highfiveEmbed = new MessageEmbed()
			.setImage(url)
			.setDescription(`${message.author} highfived ${user}!`)
			.setColor('fce3b7');
		return message.channel.send(highfiveEmbed);
	}

};
