/* eslint-disable complexity */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { Aki } = require('aki-api');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['aki'],
			description: 'Think about a real or fictional character, I will try to guess who it is.',
			category: 'Fun',
			guildOnly: true
		});
	}

	async run(message) {
		const current = this.client.games.get(message.channel.id);

		if (current) {
			message.reply(new MessageEmbed().setColor('RED').setDescription(`Please wait until the current game of \`${current.name}\` is finished.`));
			return;
		}

		this.client.games.set(message.channel.id, {
			name: this.name
		});

		try {
			const aki = new Aki('en', !message.channel.nsfw);
			let ans = null;
			let win = false;
			let timesGuessed = 0;
			let guessResetNum = 0;
			let wentBack = false;
			let forceGuess = false;
			const guessBlacklist = [];

			while (timesGuessed < 3) {
				if (guessResetNum > 0) guessResetNum--;
				if (ans === null) {
					const startMsg = await message.channel.send(new MessageEmbed()
						.setDescription(`Get ready, the game will begin momentarily`)
						.setColor('fce3b7')
						.setFooter(`You have 60 seconds to answer each question.`));
					await aki.start().then(() => {
						startMsg.delete();
					});
				} else if (wentBack) {
					wentBack = false;
				} else {
					try {
						await aki.step(ans);
					} catch {
						await aki.step(ans);
					}
				}

				if (!aki.answers || aki.currentStep >= 79) forceGuess = true;
				const answers = aki.answers.map(answer => answer.toLowerCase());
				answers.push('end');
				if (aki.currentStep > 0) answers.push('back');
				await message.channel.send(new MessageEmbed().setTitle(`Question ${aki.currentStep + 1}`)
					.setDescription(`${aki.question} (${Math.round(Number.parseInt(aki.progress, 10))}%)\n${aki.answers.join(' | ')}${aki.currentStep > 0 ? ` | Back` : ''}`)
					.setFooter(`Type 'End' to quit the game.`, message.author.displayAvatarURL())
					.setColor('fce3b7'));
				const filter = res => res.author.id === message.author.id && answers.includes(res.content.toLowerCase());
				const msgs = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 90000
				});

				if (!msgs.size) {
					win = 'time';
					break;
				}

				const choice = msgs.first().content.toLowerCase();

				if (choice === 'end') {
					forceGuess = true;
					this.client.games.delete(message.channel.id);
				} else if (choice === 'back') {
					if (guessResetNum > 0) guessResetNum++;
					wentBack = true;
					await aki.back();
					continue;
				} else {
					ans = answers.indexOf(choice);
				}
				if ((aki.progress >= 90 && !guessResetNum) || forceGuess) {
					timesGuessed++;
					guessResetNum += 10;
					await aki.win();
					const guess = aki.answers.filter(char => !guessBlacklist.includes(char.id))[0];
					if (!guess) {
						await message.channel.send(new MessageEmbed().setDescription('I can\'t think of anyone.').setColor('fce3b7'));
						win = true;
						break;
					}
					guessBlacklist.push(guess.id);
					const embed = new MessageEmbed()
						.setColor(0xF78B26)
						.setTitle(`I'm ${Math.round(guess.proba * 100)}% sure it's...`)
						.setDescription(`${guess.name}${guess.description ? `\n_${guess.description}_` : ''}`)
						.setImage(guess.absolute_picture_path || null)
						.setFooter(forceGuess ? 'Final Guess' : `Guess ${timesGuessed} - Total Questions: ${aki.currentStep + 1}`);
					const msg = await message.channel.send(embed);
					if (forceGuess === true) break;
					['✅', '❌'].forEach(async el => await msg.react(el));


					const reactionFilter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
					await msg.awaitReactions(reactionFilter, {
						max: 1,
						time: 60000,
						errors: ['time']
					}).then(collected => {
						const reaction = collected.first();

						if (reaction.emoji.name === '✅') {
							win = true;
							msg.reactions.removeAll();
						} else {
							win = false;
							msg.reactions.removeAll();
						}
					})
						.catch(() => {
							win = 'uncertain';
							msg.reactions.removeAll();
						});


					if (win === true) {
						break;
					} else if (timesGuessed >= 3 || forceGuess) {
						win = true;
						break;
					} else if (win === 'uncertain') {
						break;
					}
				}
			}

			this.client.games.delete(message.channel.id);
			if (win === 'time') {
				message.channel.send(new MessageEmbed().setColor('fce3b7').setDescription('I guess your silence means I have won.'));
				return;
			}
		} catch (err) {
			this.client.games.delete(message.channel.id);
			message.reply(new MessageEmbed().setColor('RED').setDescription(`Oh no, an error occurred: \`${err.message}\`. Try again later!`));
			return;
		}
	}

};
