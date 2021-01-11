const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const pout = require('../../../assets/JSONS/animeGifs.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliase: ['whine'],
			description: 'Pout at a specific user!',
			category: 'Anime',
			usage: '<user>'
		});
	}

	async run(message) {
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who's hand you'd like to hold!");
		}

		const url = pout.poutgif[Math.floor(Math.random() * pout.poutgif.length)];

		const poutEmbed = new MessageEmbed()
			.setImage(url)
			.setDescription(`${message.author} pouted at ${user}! Hmph!`)
			.setColor('fce3b7');
		return message.channel.send(poutEmbed);
	}

};
