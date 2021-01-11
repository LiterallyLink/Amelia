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
		let reason = args.slice(1).join(' ');
		const invalidEmbed = new MessageEmbed()
			.setColor('RED');

		if (!mentionedMember || mentionedMember === message.author.id) {
			return message.channel.send(invalidEmbed.setDescription(`Please provide a valid user.`));
		}

		const mentionedPosition = mentionedMember.roles.highest.position;
		const memberPosition = message.member.roles.highest.position;
		const botPosition = message.guild.me.roles.highest.position;

		if (memberPosition <= mentionedPosition) {
			return message.channel.send(invalidEmbed.setDescription(`You cannot ban this user as their permissions are equal to your own.`));
		} else if (botPosition <= mentionedPosition) {
			return message.channel.send(invalidEmbed.setDescription(`I cannot ban this user, as their permissions are equal to my own.`));
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
