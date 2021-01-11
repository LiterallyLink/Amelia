const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const stare = require('../../../assets/JSONS/animeGifs.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['glare'],
			description: 'Glare at a specific user!',
			category: 'Anime',
			usage: '<user>'
		});
	}

	async run(message) {
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who you'd like to stare at!");
		}

		const url = stare.staregif[Math.floor(Math.random() * stare.staregif.length)];

		const stareEmbed = new MessageEmbed()
			.setImage(url)
			.setDescription(`${user} is being stared at by ${message.author}. . .Creepy`)
			.setColor('fce3b7');
		return message.channel.send(stareEmbed);
	}

};
