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
		const mentionedMember = message.mentions.members.first();
		args.shift();
		const reason = args.join(' ');
		const invalidEmbed = new MessageEmbed()
			.setColor('RED');

		if (!mentionedMember || mentionedMember === message.author.id) {
			return message.channel.send(invalidEmbed.setDescription(`Please provide a valid user`));
		}

		const mentionedPosition = mentionedMember.roles.highest.position;
		const memberPosition = message.member.roles.highest.position;
		const botPosition = message.guild.me.roles.highest.position;

		if (memberPosition <= mentionedPosition) {
			return message.channel.send(invalidEmbed.setDescription(`You cannot kick this user as their permissions are equal to your own.`));
		} else if (botPosition <= mentionedPosition) {
			return message.channel.send(invalidEmbed.setDescription(`I cannot kick this user, as their permissions are equal to my own.`));
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

