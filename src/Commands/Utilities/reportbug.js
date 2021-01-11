/* eslint-disable consistent-return */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['bugreport', 'bug', 'rb', 'br'],
			usage: '<command> <bug>',
			description: `Sends a message to the Amelia Bot Server's bug report channel. When reporting a bug, please include as much information as possible.
            \n Note: Abuse of this feature may lead to your UUID being blacklisted from the bot. You have been warned.`,
			category: 'Utilities',
			args: true

		});
	}
	async run(message, args) {
		const error = new MessageEmbed();
		const bugCommand = args[0];
		let report = args.slice(1).join(' ');
		let thumbnail;

		if (!report) {
			return message.channel.send(error.setColor('RED').setDescription('Please provide a message to send'));
		}

		const cmd = this.client.commands.get(bugCommand) || this.client.commands.get(this.client.aliases.get(bugCommand));

		if (!cmd) {
			const embed = new MessageEmbed();
			return message.channel.send(embed.setColor(0xff0000).setDescription(`The command **${bugCommand}** does not exist, or perhaps you mispelled it?`));
		}

		const reportEmbed = new MessageEmbed()
			.setTitle('Bug Report')
			.setColor('fce3b7')
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setDescription(`Command: ${bugCommand}\nBug: **${report}**`)
			.addField('User', message.member, true)
			.addField('Server', message.guild.name, true)
			.setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(message.guild.me.displayHexColor);
		this.client.channels.cache.get('767655794756943892').send(reportEmbed);

		if (report.length > 1024) {
			report = `${report.slice(0, 1021)}...`;
		}
		if (message.guild) {
			thumbnail = message.guild.iconURL({ dynamic: true });
		} else {
			thumbnail = this.client.user.displayAvatarURL();
		}

		const embed = new MessageEmbed()
			.setTitle('Bug Reported')
			.setThumbnail(thumbnail)
			.setColor('fce3b7')
			.setDescription(`
		Successfully sent bug report!\nPlease join the [AmeliaBot Support Server](https://discord.gg/m6nYTA) to further discuss your issue.
		\nAdditionally, feel free to submit an issue on [GitHub](https://github.com/LiterallyLink/AmeliaBot/issues).`)
			.setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(message.guild.me.displayHexColor);
		return message.channel.send(embed);
	}

};
