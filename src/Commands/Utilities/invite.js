const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['inv'],
			usage: ', inv',
			category: 'Utilities',
			description: 'Provides a link you can use to invite Amelia to your server.'
		});
	}

	async run(message) {
		const inviteEmbed = new MessageEmbed()
			.setDescription(`**<:Link:724830709025341511> To invite me to your server:** [Click Here!](https://discord.com/oauth2/authorize?client_id=724481965000228886&scope=bot&permissions=1068032)`)
			.setColor('fce3b7');

		return message.channel.send(inviteEmbed);
	}

};
