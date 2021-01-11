/* eslint-disable max-len */
/* eslint-disable id-length */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['slot'],
			description: 'Try your luck at the slot machine!',
			category: 'Fun',
			usage: '<bet>',
			guildOnly: true
		});
	}

	async run(message, [bet]) {
		const balance = await this.client.economy.getCredits(message.guild.id, message.author.id);

		const slot = [];
		const border = '---------------------';
		const L = ':lemon:';
		const G = ':grapes:';
		const GE = ':gem:';
		const F = ':four_leaf_clover:';
		const A = ':apple:';
		const Q = ':grey_question:';

		const symbols = [L, G, GE, F, A];
		const doubles = {};
		doubles[':lemon:'] = 0.5;
		doubles[':apple:'] = 2;
		doubles[':four_leaf_clover:'] = 2;
		doubles[':grapes:'] = 3.5;
		doubles[':gem:'] = 7;
		const triples = {};
		triples[':lemon:'] = 2.5;
		triples[':apple:'] = 3;
		triples[':four_leaf_clover:'] = 4;
		triples[':grapes:'] = 7;
		triples[':gem:'] = 15;

		const randomSlots = new Array(3);
		randomSlots.fill('<a:fruit_slot:723119681380155423>');
		const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

		const slotHelp = new MessageEmbed()
			.addField('Help', 'Slot Machine')
			.addField('Winnings', `**${L}${L}${Q} - 0.5x\n${A}${A}${Q} - 2x\n${F}${F}${Q} - 2x\n${L}${L}${L} - 2.5x\n${A}${A}${A} - 3x\n${G}${G}${Q} - 3.5x\n${F}${F}${F} - 4x\n${GE}${GE}${Q} - 7x\n${G}${G}${G} - 7x\n${GE}${GE}${GE} - 15x**`)
			.addField('Usage', '**slots [bet]**')
			.setColor('YELLOW');

		if (!bet || isNaN(bet) || bet <= 0) {
			return message.channel.send(slotHelp);
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

		const embed = new MessageEmbed()
			.setTitle(`Slots | User: ${message.author.username} | Bet: ${bet}`)
			.setDescription(`**${border}\n| ${randomSlots.join(' | ')} |\n${border}\n--- SPINNING ---**`)
			.setColor('fce3b7');
		const msg = await message.channel.send(embed);

		for (let i = 0; i < 3; i++) {
			await sleep(1666);
			slot.push(symbols[Math.floor(Math.random() * symbols.length)]);
			randomSlots[i] = slot[i];
			msg.edit(embed.setDescription(`**${border}\n| ${randomSlots.join(' | ')} |\n${border}\n--- SPINNING ---**`));
		}

		const triplesWin = slot[0] === slot[1] && slot[0] === slot[2];
		const doublesWin = slot[0] === slot[1] || slot[1] === slot[2];
		const triplesProfit = Math.floor(bet * triples[slot[0]]);
		const doublesProfit = Math.floor(bet * doubles[slot[1]]);
		this.client.games.delete(message.channel.id);

		if (triplesWin) {
			const newBalance = await this.client.economy.addCredits(message.guild.id, message.author.id, triplesProfit);

			embed.setDescription(`**${border}\n| ${randomSlots.join(' | ')} |\n${border}\n--- YOU WON ---**`);
			embed.addFields({
				name: 'Profit',
				value: `**${triplesProfit}** credits`,
				inline: true
			}, {
				name: 'Credits',
				value: `You have ${newBalance} credits`,
				inline: true
			});
			embed.setColor('GREEN');
			return msg.edit(embed);
		} else if (doublesWin) {
			const newBalance = await this.client.economy.addCredits(message.guild.id, message.author.id, doublesProfit);

			embed.setDescription(`**${border}\n| ${randomSlots.join(' | ')} |\n${border}\n--- YOU WON ---**`);
			embed.addFields({
				name: 'Profit',
				value: `**${doublesProfit}** credits`,
				inline: true
			}, {
				name: 'Credits',
				value: `You have ${newBalance} credits`,
				inline: true
			});
			embed.setColor('GREEN');
			return msg.edit(embed);
		} else {
			const newBalance = await this.client.economy.addCredits(message.guild.id, message.author.id, bet * -1);

			embed.setDescription(`**${border}\n| ${randomSlots.join(' | ')} |\n${border}\n--- YOU LOSE ---**`);
			embed.addFields({
				name: 'Profit',
				value: `**${bet * -1}** credits`,
				inline: true
			}, {
				name: 'Credits',
				value: `You have ${newBalance} credits`,
				inline: true
			});
			embed.setColor('RED');
			return msg.edit(embed);
		}
	}

};
