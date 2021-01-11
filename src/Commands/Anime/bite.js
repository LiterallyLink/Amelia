const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const bite = require('../../../assets/JSONS/animeGifs.json');

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
		const url = bite.biteGif[Math.floor(Math.random() * bite.biteGif.length)];
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send('Please specify who you would like to bite!');
		}

		const biteEmbed = new MessageEmbed()
			.setImage(url)
			.setDescription(`${user} was bitten by ${message.author}! Youch!`)
			.setColor('fce3b7');
		return message.channel.send(biteEmbed);
	}

};
