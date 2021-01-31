const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: "Ban's a specified user.",
			category: 'Moderation',
			usage: '[member], [member] [reason]',
			userPerms: ['ADMINISTRATOR', 'BAN_MEMBERS'],
			botPerms: ['ADMINISTRATOR', 'BAN_MEMBERS'],
			args: true,
			guildOnly: true
		});
	}

	async run(message, args) {
		const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		const mentionedPosition = mentionedMember.roles.highest.position;
		const memberPosition = message.member.roles.highest.position;
		let reason = args.shift();
		// const botPosition = message.guild.me.roles.highest.position;

		if (message.author.id !== message.guild.ownerID) {
			const hasPermission = this.client.utils.comparePerms(mentionedPosition, memberPosition);
			if (!hasPermission) {
				console.log('idk');
			}
		}

		if (!reason) {
			reason = 'No reason given.';
		}

		const embed = new MessageEmbed()
			.setDescription(`${mentionedMember} was successfully banned.`)
			.addField('Moderator', message.member, true)
			.addField('Member', mentionedMember, true)
			.addField('Reason', reason)
			.setColor('GREEN')
			.setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		mentionedMember.ban(args[0]);
		return message.channel.send(embed);
	}

};
