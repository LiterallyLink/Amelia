const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['git'],
			description: "Returns the bot's github",
			category: 'Misc'
		});
	}

	async run(message) {
		const github = new MessageEmbed()
			.setDescription(`[Amelia's Github](https://github.com/LiterallyLink/Watson-Amelia)`)
			.setColor('fce3b7');

		return message.channel.send(github);
	}

};
