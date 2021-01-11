const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: '',
			category: 'Misc',
			usage: 'cat dog',
			guildOnly: true
		});
	}

	async run(message, args) {
		const choice = args[Math.floor(Math.random() * args.length)];
		const embed = new MessageEmbed()
			.setDescription(`${message.author.username}, I pick **${choice}**`)
			.setColor('fce3b7');
		message.channel.send(embed);
	}

};
