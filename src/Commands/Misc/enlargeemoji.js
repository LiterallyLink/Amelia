const { MessageEmbed } = require('discord.js');
const { parse } = require('twemoji-parser');
const Command = require('../../Structures/Command');
const Discord = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['enlarge'],
			description: 'Enlarges a specified emoji.',
			category: 'Misc',
			usage: '<emoji>',
			guildOnly: true,
			args: true
		});
	}

	async run(message, [emoji]) {
		const custom = Discord.Util.parseEmoji(emoji);

		if (custom.id) {
			const embed = new MessageEmbed()
				.setTitle(`Enlarged version of ${emoji}`)
				.setColor('fce3b7')
				.setImage(`https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? 'gif' : 'png'}`);

			return message.channel.send(embed);
		} else {
			const parsed = parse(emoji, { assetType: 'png' });

			if (!parsed[0] || parsed[0].url === undefined) {
				const errorParsed = new MessageEmbed()
					.setTitle('Youch! I bumped into an error!')
					.setColor(0xff0000)
					.addField('Error', `\`\`\`Invalid Emoji Given.\`\`\``)
					.setTimestamp();

				return message.channel.send(errorParsed);
			}
			const embed = new MessageEmbed()
				.setTitle(`Enlarged version of ${emoji}`)
				.setColor('fce3b7')
				.setImage(parsed[0].url);

			return message.channel.send(embed);
		}
	}

};
