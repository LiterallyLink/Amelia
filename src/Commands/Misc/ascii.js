const Command = require('../../Structures/Command');
const figlet = require('util').promisify(require('figlet'));
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['banner'],
			description: 'Creates a ASCII banner out of the given text.',
			category: 'Misc',
			usage: '<text>',
			args: true
		});
	}

	async run(message, args) {
		const str = args.slice(0).join(' ');

		if (str.length > 15) {
			const errorEmbed = new MessageEmbed()
				.setTitle('Youch! I bumped into an error!')
				.setColor(0xff0000)
				.addField('Error', `\`\`\`Given text must be be between 1-14 characters.\`\`\``)
				.setTimestamp();
			return message.channel.send(errorEmbed);
		}
		return message.channel.send(await figlet(str), { code: true });
	}

};
