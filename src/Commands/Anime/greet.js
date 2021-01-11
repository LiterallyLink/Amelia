const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const greeting = require('../../../assets/JSONS/animeGifs.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliase: ['wave', 'hi'],
			description: 'Say hi to a specific user!',
			category: 'Anime',
			usage: '<user>'
		});
	}

	async run(message) {
		const url = greeting.greetingGif[Math.floor(Math.random() * greeting.greetingGif.length)];
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who you'd like to greet!");
		}

		const greetingEmbed = new MessageEmbed()
			.setImage(url)
			.setDescription(`${message.author} greeted ${user}!`)
			.setColor('fce3b7');
		return message.channel.send(greetingEmbed);
	}

};
