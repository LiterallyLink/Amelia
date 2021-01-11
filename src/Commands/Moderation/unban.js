/* eslint-disable consistent-return */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: "Unban's a specified user.",
			category: 'Moderation',
			usage: '<user> [reason]',
			userPerms: ['ADMINISTRATOR', 'BAN_MEMBERS'],
			botPerms: ['ADMINISTRATOR', 'BAN_MEMBERS'],
			args: true,
			guildOnly: true
		});
	}

	async run(message, args) {
		const errorEmbed = new MessageEmbed()
			.setColor('RED');

		let member;

		try {
			member = await this.client.users.fetch(args[0]);
		} catch (err) {
			return message.channel.send(errorEmbed.setDescription(`\`${args[0]}\` is not a valid user.`));
		}

		const embed = new MessageEmbed()
			.setFooter(`${message.author.tag} | ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }));

		message.guild.fetchBans().then(bans => {
			const user = bans.find(ban => ban.user.id === member.id);

			if (user) {
				embed.setTitle(`Successfully Unbanned ${user.user.tag}`)
					.setColor('#00ff00')
					.addField('User ID', user.user.id, true);
				return message.guild.members.unban(user.user.id).then(() => message.channel.send(embed));
			} else {
				embed.setTitle(`User ${member.tag} is not banned.`)
					.setColor('#ff0000');
				return message.channel.send(embed);
			}
		});
	}

};
