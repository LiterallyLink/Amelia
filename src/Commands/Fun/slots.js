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
		const symbols = ['🍋', '🍇', '💎', '🍀', '🍎'];
		const doubles = {};
		doubles['🍋'] = 0.5;
		doubles['🍎'] = 2;
		doubles['🍀'] = 2;
		doubles['🍇'] = 3.5;
		doubles['💎'] = 7;
		const triples = {};
		triples['🍋'] = 2.5;
		triples['🍎'] = 3;
		triples['🍀'] = 4;
		triples['🍇'] = 7;
		triples['💎'] = 15;

		const randomSlots = new Array(3);
		randomSlots.fill('<a:fruit_slot:723119681380155423>');
		const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

		const slotHelp = new MessageEmbed()
			.addField('Help', 'Slot Machine')
			.addField('Winnings', `**🍋🍋❔ - 0.5x\n🍎🍎❔ - 2x\n🍀🍀❔ - 2x\n🍋🍋🍋 - 2.5x\n🍎🍎🍎 - 3x\n🍇🍇❔ - 3.5x\n🍀🍀🍀 - 4x\n💎💎❔ - 7x\n🍇🍇🍇 - 7x\n💎💎💎 - 15x**`)
			.addField('Usage', '**slots [bet]**')
			.setColor('YELLOW');

		if (!bet || !this.client.utils.isWhole(bet) || bet <= 0) {
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
			await sleep(1700);
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
