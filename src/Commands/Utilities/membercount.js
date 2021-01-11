const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['mc'],
			description: 'Displays the total users in your guild.',
			category: 'Utilities',
			guildOnly: true
		});
	}

	async run(message) {
		const members = message.guild.members.cache;
		const membercountEmbed = new MessageEmbed()
			.setTitle('Member Count')
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setColor('fce3b7')
			.setDescription([
				`There are a total of **${message.guild.memberCount}** members in this server.`,
				`**Humans:** ${members.filter(member => !member.user.bot).size}`,
				`**Bots:** ${members.filter(member => member.user.bot).size}`
			]);
		message.channel.send(membercountEmbed);
	}

};
