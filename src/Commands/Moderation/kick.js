const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: "Kick's a specified user from a guild.",
			aliases: ['yeet'],
			category: 'Moderation',
			usage: '<member> , <member> <reason>',
			userPerms: ['KICK_MEMBERS'],
			botPerms: ['KICK_MEMBERS'],
			args: true,
			guildOnly: true
		});
	}

	async run(message, args) {
		const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		const mentionedPosition = mentionedMember.roles.highest.position;
		const memberPosition = message.member.roles.highest.position;
		const reason = args.join(' ');
		// const botPosition = message.guild.me.roles.highest.position;

		if (message.author.id !== message.guild.ownerID) {
			const hasPermission = this.client.utils.comparePerms(mentionedPosition, memberPosition);
			if (!hasPermission) {
				message.channel.send(new MessageEmbed().setDescription(hasPermission));
			}
		}

		const embed = new MessageEmbed()
			.setDescription(`${mentionedMember} was kicked.`)
			.addField('Action By', message.member)
			.addField('Member', mentionedMember)
			.addField('Reason', `${reason || 'No reason given.'}`)
			.setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
			.setColor('GREEN')
			.setTimestamp();

		mentionedMember.kick(args[0]);
		return message.channel.send(embed);
	}

};

