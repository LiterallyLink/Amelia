const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliase: ['chomp'],
			description: 'Wink at a specific user!',
			category: 'Anime',
			usage: '<user>'
		});
	}

	async run(message) {
		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send("Please specify who you'd like to tickle");
		}

		const { body } = await request
			.get('https://some-random-api.ml/animu/wink');

		const wink = new MessageEmbed()
			.setImage(body.link)
			.setDescription(`${message.author} winked at ${user}!`)
			.setColor('fce3b7');
		return message.channel.send(wink);
	}

};
