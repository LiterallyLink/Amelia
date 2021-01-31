const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const userReg = RegExp(/<@!?(\d+)>/);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: "Unban's a specified user.",
			category: 'Moderation',
			usage: '<user> [reason]',
			userPerms: ['ADMINISTRATOR', 'BAN_MEMBERS'],
			botPerms: ['ADMINISTRATOR', 'BAN_MEMBERS'],
			guildOnly: true
		});
	}

	async run(message, args) {
		const userID = userReg.test(args[0]) ? userReg.exec(args[0])[1] : args[0];
		const mentionedUser = await message.client.users.fetch(userID).catch(() => null);

		if (!mentionedUser) {
			await message.guild.fetchBans().then(banned => {
				let list = banned.map(member => member.user.id).join('\n');
				if (list.length >= 1950) list = `${list.slice(0, 1948)}...`;
				if (!list.length) list = 'None';
				const embed = new MessageEmbed()
					.setAuthor('List of currently banned users', message.guild.iconURL())
					.setDescription(`\`\`\`${list}\`\`\``)
					.setFooter(`User mention (@User) or user ID (724481965000228886)`)
					.setColor('fce3b7');
				message.channel.send(embed);
			});
			return;
		}

		const allBans = await message.guild.fetchBans();
		const bannedUser = allBans.get(mentionedUser.id);

		if (!bannedUser) {
			message.channel.send('This user is not banned or does not exist').then(msg => msg.delete({ timeout: 5000 }));
			return;
		}

		message.guild.members.unban(mentionedUser.id).catch(err => console.log(err));

		const embed = new MessageEmbed()
			.setAuthor(`${mentionedUser.username} has been unbanned`, message.guild.iconURL({ dynamic: true }))
			.setColor('fce3b7');

		message.channel.send(embed);
	}

};
