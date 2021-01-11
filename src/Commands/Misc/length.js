const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Returns the length of a given message.',
			category: 'Misc',
			usage: '<message>'
		});
	}

	async run(message, args) {
		const str = args.slice(0).join(' ');
		const { length } = str;

		message.channel.send(`Your message is ${length} character(s) long.`);
	}

};
