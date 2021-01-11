/* eslint-disable consistent-return */
const Command = require('../../Structures/Command');
const { stripIndents } = require('common-tags');
const request = require('node-superfetch');
const scores = require('../../../assets/JSONS/anagramicaScore');
const pool = require('../../../assets/JSONS/anagramicaProbability');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['anagramica'],
			description: 'Guess as many words as you can from a random assortment of letters.',
			category: 'Fun',
			guildOnly: true
		});
	}

	async run(message) {
		const content = message.content.substring(9, 12);
		const time = 60;
		const anagram = new MessageEmbed();
		const current = this.client.games.get(message.author.id);

		if (content.toLowerCase() === 'end' && !current) {
			return message.channel.send(anagram.setColor('RED').setDescription('There is no active game of anagram to end.'));
		} else if (content.toLowerCase() === 'end' && current) {
			this.client.games.delete(message.author.id);
			return message.channel.send(anagram.setColor('RED').setDescription('You ended the current game of Anagram.'));
		}

		if (current) {
			return message.channel.send(anagram.setColor('fce3b7').setDescription(`Please wait until the current game of \`${current.name}\` is finished.\nTo end the current game, use "!anagram end".`));
		}

		try {
			this.client.games.set(message.author.id, {
				name: this.name
			});

			const { valid, letters } = await this.fetchList();
			let points = 0;

			await message.reply(anagram.setTitle('Anagramica - Start Guessing!')
				.setDescription(stripIndents `${letters.map(letter => `\`${letter.toUpperCase()}\``).join(' ')}`)
				.setFooter(`You have ${time} seconds to provide anagrams for the following letters.`)
				.setColor('fce3b7'));
			const picked = [];

			const filter = res => {
				if (res.author.id !== message.author.id) return false;
				if (picked.includes(res.content.toLowerCase())) return false;
				const score = this.getScore(letters, res.content.toLowerCase());
				if (!score) return false;
				if (!valid.includes(res.content.toLowerCase())) {
					points -= score;
					picked.push(res.content.toLowerCase());
					res.react('❌').catch(() => null);
					return false;
				}
				points += score;
				picked.push(res.content.toLowerCase());
				res.react('✅').catch(() => null);
				return true;
			};

			const msgs = await message.channel.awaitMessages(filter, {
				time: time * 1000
			});

			if (this.client.games.get(message.author.id)) {
				this.client.games.delete(message.author.id);
				if (!msgs.size) return message.channel.send('Couldn\'t even think of one? Ouch.');
				if (points < 1) return message.channel.send(`Ouch, your final score was **${points}**. Try harder next time!`);
				return message.channel.send(`Nice job! Your final score was **${points}**!`);
			}
		} catch (err) {
			this.client.games.delete(message.author.id);
			return message.channel.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchList() {
		const letters = [];
		for (let i = 0; i < 10; i++) {
			letters.push(this.client.utils.weightedRandom(pool));
		}
		const { body } = await request.get(`http://www.anagramica.com/all/${letters.join('')}`);
		return {
			valid: body.all,
			letters
		};
	}

	getScore(letters, word) {
		let score = 0;
		for (const letter of word.split('')) {
			if (!letters.includes(letter)) return null;
			score += scores[letter];
		}
		return score;
	}

};
