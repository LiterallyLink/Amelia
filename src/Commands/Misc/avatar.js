const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['av', 'icon'],
			description: 'Provides the avatar of the mentioned user or message author.',
			category: 'Misc',
			usage: '<user>'
		});
	}

	async run(message, [target]) {
		const member = this.client.utils.getMember(message, target);
		const avatar = member.user.displayAvatarURL({ size: 4096, dynamic: true });

		const embed = new MessageEmbed()
			.setTitle(`${member.user.tag} Avatar:`)
			.setColor(member.displayHexColor || 'fce3b7')
			.setImage(avatar)
			.setDescription(`[Link to avatar](${avatar})`);

		message.channel.send(embed);
	}

};
