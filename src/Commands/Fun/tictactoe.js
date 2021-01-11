const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'A game of tic tac toe.',
			category: 'Fun',
			guildOnly: true,
			botPerms: ['MANAGE_MESSAGES']
		});
	}

	async run(message) {
		const current = this.client.games.get(message.channel.id);
		const opponent = message.mentions.members.first();
		const sides = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
		const taken = [];
		let userTurn = true;
		let winner = null;
		let lastTurnTimeout = false;
		const gui = new MessageEmbed();
		const embed = new MessageEmbed();

		if (!opponent) {
			return message.channel.send(embed.setDescription('Please mention a valid user to play with.').setColor('RED'));
		}

		if (current) {
			return message.reply(embed.setDescription(`Please wait until the current game of \`${current.name}\` is finished.`).setColor('RED'));
		}

		this.client.games.set(message.channel.id, { name: this.name });

		const msg = await message.channel.send(gui.setDescription(stripIndents`
		${message.author}, which number do you pick? Type \`end\` to forefeit.
		\`\`\`
		${sides[0]} | ${sides[1]} | ${sides[2]}
		—————————
		${sides[3]} | ${sides[4]} | ${sides[5]}
		—————————
		${sides[6]} | ${sides[7]} | ${sides[8]}
		\`\`\``)
			.setColor('fce3b7'));

		while (!winner && taken.length < 9) {
			const user = userTurn ? message.author : opponent;
			const sign = userTurn ? 'x' : 'o';
			msg.edit(gui.setDescription(stripIndents`
				${user}, which number do you pick? Type \`end\` to forefeit.
				\`\`\`
				${sides[0]} | ${sides[1]} | ${sides[2]}
				—————————
				${sides[3]} | ${sides[4]} | ${sides[5]}
				—————————
				${sides[6]} | ${sides[7]} | ${sides[8]}
				\`\`\`
			`)
				.setFooter('You have 60 seconds to reply or your turn will be skipped.'));
			const filter = res => {
				if (res.author.id !== user.id) return false;
				const choice = res.content;
				if (choice.toLowerCase() === 'end') return true;
				return sides.includes(choice) && !taken.includes(choice);
			};
			const turn = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 60000
			});
			if (!turn.size) {
				await message.channel.send(embed.setDescription(`Sorry ${user}, you ran out of time so your turn was skipped.`).setColor('RED'));
				if (lastTurnTimeout) {
					winner = 'time';
					break;
				} else {
					userTurn = !userTurn;
					lastTurnTimeout = true;
					continue;
				}
			}
			const choice = turn.first().content;
			turn.first().delete();
			if (choice.toLowerCase() === 'end') {
				winner = userTurn ? opponent : message.author;
				break;
			}
			sides[Number.parseInt(choice, 10) - 1] = sign;
			taken.push(choice);
			if (this.verifyWin(sides)) winner = userTurn ? message.author : opponent;
			if (lastTurnTimeout) lastTurnTimeout = false;
			userTurn = !userTurn;
		}
		this.client.games.delete(message.channel.id);
		if (winner === 'time') return message.channel.send(embed.setDescription('Game ended due to inactivity.').setColor('RED'));
		return message.channel.send(winner ? embed.setDescription(`Congrats, ${winner}! You win!`).setColor('GREEN') : embed.setDescription(`It's a draw!`).setColor('fce3b7'));
	}

	verifyWin(sides) {
		return (sides[0] === sides[1] && sides[0] === sides[2]) ||
		(sides[0] === sides[3] && sides[0] === sides[6]) ||
		(sides[3] === sides[4] && sides[3] === sides[5]) ||
		(sides[1] === sides[4] && sides[1] === sides[7]) ||
		(sides[6] === sides[7] && sides[6] === sides[8]) ||
		(sides[2] === sides[5] && sides[2] === sides[8]) ||
		(sides[0] === sides[4] && sides[0] === sides[8]) ||
		(sides[2] === sides[4] && sides[2] === sides[6]);
	}

};
