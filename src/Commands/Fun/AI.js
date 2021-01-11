const Command = require('../../Structures/Command');
const Alexa = require('alexa-bot-api');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['chat'],
			description: 'Talk with the bot!',
			category: 'Fun',
			usage: '<message>, !chat <message>',
			args: true,
			guildOnly: true
		});
	}

	async run(message, args) {
		const ai = new Alexa('aw2plm');
		ai.getReply(args.join(' ')).then(reply => message.channel.send(`> Replying to ${message.author.username}\n${reply}`));
	}

};
