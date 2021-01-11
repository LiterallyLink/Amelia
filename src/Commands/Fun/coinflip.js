const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['cf', 'coin'],
			description: 'Flip a coin!',
			category: 'Fun',
			guildOnly: true
		});
	}

	async run(message) {
		const outcome = Math.random() > 0.5 ? 'Heads' : 'Tails';
		const embed = new MessageEmbed()
			.setColor('fce3b7')
			.setDescription(`You got ${outcome}! <:Coin:724856585335078953> `);

		message.channel.send(embed);
	}

};
