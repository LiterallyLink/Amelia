/* eslint-disable consistent-return */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const emoji = require('../../../assets/JSONS/blackjackEmojis.json');

const input = ['hit', 'stay'];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			category: 'Fun',
			usage: '<credits>',
			guildOnly: true,
			args: true
		});
	}

	async run(message, [bet]) {
		const balance = await this.client.economy.getCredits(message.guild.id, message.author.id);

		if (!this.client.utils.isWhole(bet) || bet <= 0) {
			return message.channel.send('invalid credits');
		} else if (bet > balance) {
			return message.channel.send(new MessageEmbed().setDescription(`You don't have enough credits.\nYou have ${balance} credits`).setColor('RED'));
		}

		const current = this.client.games.get(message.channel.id);

		if (current) {
			return message.reply(new MessageEmbed().setColor('RED').setDescription(`Please wait until the current game of \`${current.name}\` is finished.`));
		}

		this.client.games.set(message.channel.id, {
			name: this.name
		});

		const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
		const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		let players = [];
		const playerHand = [];
		const dealersHand = [];
		let deck = [];
		let win = false;

		function createDeck() {
			deck = [];
			for (let i = 0; i < values.length; i++) {
				for (let j = 0; j < suits.length; j++) {
					let weight = parseInt(values[i]);
					if (values[i] === 'J' || values[i] === 'Q' || values[i] === 'K') { weight = 10; }
					if (values[i] === 'A') { weight = 11; }
					const card = {
						Value: values[i],
						Suit: suits[j],
						Weight: weight
					};
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
				const player = {
					Name: `Player ${i}`,
					ID: i,
					Points: 0,
					Hand: hand
				};
				players.push(player);
			}
		}

		function getPoints(player) {
			let points = 0;
			for (let i = 0; i < players[player].Hand.length; i++) {
				points += players[player].Hand[i].Weight;
			}
			players[player].Points = points;
			return points;
		}

		function updatePoints() {
			for (let i = 0; i < players.length; i++) {
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

		function getHands() {
			for (let j = 0; j < 2; j++) {
				playerHand.push(`${emoji[players[0].Hand[j].Value + players[0].Hand[j].Suit]}`);
				dealersHand.push(`${emoji[players[1].Hand[j].Value + players[1].Hand[j].Suit]}`);
			}
		}

		function hitMe(num, hand) {
			const card = deck.pop();
			players[num].Hand.push(card);
			hand.push(`${emoji[card.Value + card.Suit]}`);
			updatePoints();
		}

		createDeck();
		shuffle();
		createPlayers();
		dealHands();
		getHands();

		const embed = new MessageEmbed()
			.setAuthor('Blackjack', message.author.displayAvatarURL())
			.setDescription(stripIndents`**Your Hand: ${players[0].Points}\n${playerHand.join('')}\nThe dealer shows:**\n${dealersHand[0]}`)
			.setFooter('Hit or stay?')
			.setColor('fce3b7');
		message.channel.send(embed);

		try {
			while (!win) {
				const filter = res => res.author.id === message.author.id && input.includes(res.content.toLowerCase());
				const msgs = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 60000
				});

				if (!msgs.size) {
					this.client.games.delete(message.channel.id);
					return message.channel.send('a');
				}

				const choice = msgs.first().content.toLowerCase();

				if (choice === input[0]) {
					hitMe(0, playerHand);

					if (players[0].Points > 21) {
						await this.client.economy.addCredits(message.guild.id, message.author.id, bet * -1);
						this.client.games.delete(message.channel.id);
						message.channel.send(embed
							.setDescription(stripIndents`**Your Hand: ${players[0].Points}\n${playerHand.join('')}\nDealer's cards: ${players[1].Points}**\n${dealersHand.join('')}`)
							.setFooter(`🚫 Bust!`));
						win = true;
						break;
					}
					message.channel.send(embed.setDescription(stripIndents`**Your Hand: ${players[0].Points}\n${playerHand.join('')}\nThe dealer shows:**\n${dealersHand[0]}`));
				} else if (choice === input[1]) {
					while (players[0].Points > players[1].Points && players[1].Points <= 21) {
						hitMe(1, dealersHand);
					}

					this.client.games.delete(message.channel.id);
					if (players[0].Points > players[1].Points || players[1].Points > 21) {
						await this.client.economy.addCredits(message.guild.id, message.author.id, bet);
						message.channel.send(embed
							.setDescription(stripIndents`**Your Hand: ${players[0].Points}\n${playerHand.join('')}\nDealer's cards: ${players[1].Points}**\n${dealersHand.join('')}`)
							.setFooter(`💸 You won ${bet * 2} credits!`));
						win = true;
						break;
					} else if (players[0].Points < players[1].Points) {
						await this.client.economy.addCredits(message.guild.id, message.author.id, bet * -1);
						this.client.games.delete(message.channel.id);
						message.channel.send(embed
							.setDescription(stripIndents`**Your Hand: ${players[0].Points}\n${playerHand.join('')}\nDealer's cards: ${players[1].Points}**\n${dealersHand.join('')}`)
							.setFooter(`The dealer won!`));
						win = true;
						break;
					} else {
						this.client.games.delete(message.channel.id);
						message.channel.send(embed
							.setDescription(stripIndents`**Your Hand: ${players[0].Points}\n${playerHand.join('')}\nDealer's cards: ${players[1].Points}**\n${dealersHand.join('')}`)
							.setFooter(`Returned ${bet} credits`));
						win = true;
						break;
					}
				}
			}
		} catch (err) {
			this.client.games.delete(message.channel.id);
			throw err;
		}
	}

};
