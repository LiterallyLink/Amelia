const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['exit', 'shutdown', 'annihilate', 'obliterate'],
			description: "Shut's the bot off",
			category: 'Developer',
			ownerOnly: true
		});
	}

	async run(message) {
		await message.channel.send(`Shutting down.`);
		return process.exit();
	}

};
