const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const cheer = require('../../../assets/JSONS/animeGifs.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliase: ['chomp'],
			description: 'Bite a specific user!',
			category: 'Anime',
			usage: '<user>'
		});
	}

	async run(message) {
		const url = cheer.cheerGif[Math.floor(Math.random() * cheer.cheerGif.length)];
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send('Please specify who you would like to cheer for!');
		}

		const biteEmbed = new MessageEmbed()
			.setImage(url)
			.setDescription(`${message.author} cheered for ${user}!`)
			.setColor('fce3b7');
		return message.channel.send(biteEmbed);
	}

};
