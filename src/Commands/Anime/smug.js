const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const smug = require('../../../assets/JSONS/animeGifs.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Give a specific user a smug look!',
			category: 'Anime',
			usage: '<user>'
		});
	}

	async run(message) {
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who you'd like to give a smug look at!");
		}

		const url = smug.smugGif[Math.floor(Math.random() * smug.smugGif.length)];

		const smugEmbed = new MessageEmbed()
			.setImage(url)
			.setDescription(`${message.author} sent a smug look towards ${user}! Ohoho!`)
			.setColor('fce3b7');
		return message.channel.send(smugEmbed);
	}

};
