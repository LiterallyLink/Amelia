const HangmanGame = require('hangcord');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'A simple game of hangman.',
			category: 'Fun',
			guildOnly: true
		});
	}

	async run(message) {
		const hangman = new HangmanGame({
			title: 'Hangman',
			color: 'fce3b7',
			timestamp: true,
			gameOverTitle: 'Game Over'
		});

		hangman.newGame(message);
	}

};

