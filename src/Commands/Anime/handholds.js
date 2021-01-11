const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const hands = require('../../../assets/JSONS/animeGifs.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Hold hands with a specific user!',
			category: 'Anime',
			usage: '@user'
		});
	}

	async run(message) {
		const url = hands.highfiveGif[Math.floor(Math.random() * hands.handGif.length)];
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who's hand you'd like to hold");
		}

		const handEmbed = new MessageEmbed()
			.setImage(url)
			.setDescription(`${message.author} held ${user}'s hand. How sweet.`)
			.setColor('fce3b7');
		return message.channel.send(handEmbed);
	}

};
