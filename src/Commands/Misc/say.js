const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['repeat'],
			description: 'Repeats what you say!',
			category: 'Misc',
			usage: '<message>, say <channel> <message>',
			args: true
		});
	}

	async run(message, args) {
		message.delete().catch();

		let argsresult;
		const mChannel = message.mentions.channels.first();

		if (mChannel) {
			argsresult = args.slice(1).join(' ');
			mChannel.send(argsresult);
		} else {
			argsresult = args.join(' ');
			message.channel.send(argsresult);
		}
		return console.log(`${message.author.tag} used !say to say ${argsresult} in ${message.guild.name}`);
	}

};
