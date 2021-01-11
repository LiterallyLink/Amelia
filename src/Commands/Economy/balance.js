const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['bal'],
			description: 'Returns the balance of a specified user',
			category: 'Economy',
			usage: '<user>',
			guildOnly: true
		});
	}

	async run(message) {
		const target = message.mentions.users.first() || message.author;
		const credits = await this.client.economy.getCredits(message.guild.id, target.id);
		return message.channel.send(new MessageEmbed().setAuthor(target.username, target.displayAvatarURL()).setColor('fce3b7').setDescription(`Balance: ${this.client.utils.formatNumber(credits)}`));
	}

};
