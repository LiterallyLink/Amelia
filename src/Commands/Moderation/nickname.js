const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['nick', 'setnick'],
			description: 'Renames a specified user.',
			category: 'Moderation',
			usage: '@user <nickname>',
			userPerms: ['CHANGE_NICKNAME', 'MANAGE_NICKNAMES'],
			botPerms: ['CHANGE_NICKNAME', 'MANAGE_NICKNAMES'],
			args: true,
			guildOnly: true
		});
	}

	async run(message, args) {
		const target = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[0]));
		const mentionedPosition = target.roles.highest.position;
		const memberPosition = message.member.roles.highest.position;
		const botPosition = message.guild.me.roles.highest.position;

		const errorEmbed = new MessageEmbed()
			.setColor('RED')
			.setTimestamp();

		if (!target.id) {
			return message.channel.send(errorEmbed.setDescription(`Please provide a valid user`));
		}

		if (memberPosition <= mentionedPosition) {
			return message.channel.send(errorEmbed.setDescription(`${target}'s roles are higher than your roles.`));
		} else if (botPosition <= mentionedPosition) {
			return message.channel.send(errorEmbed.setDescription(`My role's are below ${target}'s roles.`));
		}

		const member = message.guild.members.cache.get(target.id);

		args.shift();
		const nickname = args.join(' ');

		if (!nickname || nickname.length > 32) {
			return message.channel.send(errorEmbed.setDescription('Error', `\`\`\`Nickname must be within 1-32 characters.\`\`\``));
		}

		const embed = new MessageEmbed()
			.setAuthor(`${message.author.username} - (${message.author.id})`, message.author.displayAvatarURL())
			.setThumbnail(message.author.displayAvatarURL())
			.setColor('fce3b7')
			.setDescription(`
            **New Name:** ${nickname}
            **Action:** ${target} Nickname Changed.
            **Channel:** ${message.channel}
        `);
		member.setNickname(nickname);
		return message.channel.send(embed);
	}

};
