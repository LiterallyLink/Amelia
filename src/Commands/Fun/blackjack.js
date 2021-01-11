const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');


module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			category: 'Fun',
			guildOnly: true
		});
	}

	async run(message) {
		const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
		const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		let players = [];
		let deck = [];

		function createDeck() {
			deck = [];
			for (let i = 0; i < values.length; i++) {
				for (let j = 0; j < suits.length; j++) {
					let weight = parseInt(values[i]);
					if (values[i] === 'J' || values[i] === 'Q' || values[i] === 'K') { weight = 10; }
					if (values[i] === 'A') { weight = 11; }
					const card = { Value: values[i], Suit: suits[j], Weight: weight };
					deck.push(card);
				}
			}
		}


		function shuffle() {
			for (let i = 0; i < 1000; i++) {
				const location1 = Math.floor(Math.random() * deck.length);
				const location2 = Math.floor(Math.random() * deck.length);
				const tmp = deck[location1];

				deck[location1] = deck[location2];
				deck[location2] = tmp;
			}
		}

		function createPlayers() {
			players = [];
			for (let i = 1; i <= 2; i++) {
				const hand = [];
				const player = { Name: `Player ${i}`, ID: i, Points: 0, Hand: hand };
				players.push(player);
			}
		}

		function getPoints(player) {
			var points = 0;
			for (var i = 0; i < players[player].Hand.length; i++) {
				points += players[player].Hand[i].Weight;
			}
			players[player].Points = points;
			return points;
		}

		function updatePoints() {
			for (var i = 0; i < players.length; i++) {
				getPoints(i);
			}
		}

		function dealHands() {
			for (let i = 0; i < 2; i++) {
				for (let j = 0; j < 2; j++) {
					const card = deck.pop();
					players[j].Hand.push(card);
					updatePoints();
				}
			}
		}

		createDeck();
		shuffle();
		createPlayers();
		dealHands();

		const embed = new MessageEmbed()
			.setDescription(`${players[0].Hand[0].Value}${players[0].Hand[0].Suit} ${players[0].Hand[1].Value}${players[0].Hand[1].Suit} -- ${players[0].Points}\n
            ${players[1].Hand[0].Value}${players[0].Hand[0].Suit} ${players[1].Hand[1].Value}${players[0].Hand[1].Suit} -- ${players[1].Points}`);
		const msg = await message.channel.send(embed);
		msg.react('🛑');
		msg.react('✅');
		msg.react('🟡');
	}

};
