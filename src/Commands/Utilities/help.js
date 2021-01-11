const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');
const GuildSchema = require('../../Models/guildSchema.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Provides information about commands.',
			category: 'Utilities',
			usage: ', help <command name>'
		});
	}

	async run(message, [command]) {
		let guildName;
		let icon;
		let prefixMessage;
		let chosenPrefix = this.client.prefix;

		if (message.guild) {
			const settings = await GuildSchema.findOne({
				guildID: message.guild.id
			});

			guildName = message.guild.name;
			icon = message.guild.iconURL({ dynamic: true });
			chosenPrefix = settings.prefix;
			prefixMessage = `for ${guildName} is \`${chosenPrefix}\``;
		} else {
			guildName = 'Amelia Bot';
			icon = this.client.user.displayAvatarURL();
			prefixMessage = `is \`${chosenPrefix}\``;
		}

		const embed = new MessageEmbed()
			.setColor('fce3b7')
			.setAuthor(`${guildName} Help Menu`, icon)
			.setThumbnail(this.client.user.displayAvatarURL());

		if (command) {
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

			if (!cmd) {
				return message.channel.send(embed.setColor(0xff0000).setDescription(`The command **${command.toLowerCase()}** does not exist, or perhaps you mispelled it?`));
			}

			embed.setAuthor(`${this.client.utils.capitalise(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
			embed.setDescription([
				`**• Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
				`**• Description:** ${cmd.description}`,
				`**• Category:** ${cmd.category}`,
				`**• Usage:** ${cmd.usage}`
			]);

			return message.channel.send(embed);
		} else {
			embed.setDescription([
				`My prefix ${prefixMessage}\nType ${chosenPrefix}help [command] for more help eg. ${chosenPrefix}help \`ping\``

			])
				.setFooter(`${this.client.user.username} | Total Commands: ${this.client.commands.size}`, this.client.user.displayAvatarURL())
				.setTimestamp();
			let categories;
			if (!this.client.owners.includes(message.author.id)) {
				categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));
			} else {
				categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));
			}

			for (const category of categories) {
				embed.addField(`**${this.client.utils.capitalise(category)}**`, this.client.commands.filter(cmd =>
					cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '), true);
			}
			return message.channel.send(embed);
		}
	}

};
