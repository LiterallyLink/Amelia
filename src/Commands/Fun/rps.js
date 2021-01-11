const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');
const chooseArr = ['🧱', '📄', '✂️'];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Play rock paper scissors with Amelia!',
			category: 'Fun'
		});
	}

	async run(message) {
		const embed = new MessageEmbed()
			.setColor('fce3b7')
			.setFooter('A simple game of rock paper scissors')
			.setDescription('Rock, Paper, Scissors, Shoot!');

		const current = this.client.games.get(message.channel.id);

		if (current) {
			message.reply(embed.setColor('RED').setDescription(`Please wait until the current game of \`${current.name}\` is finished.`));
			return;
		}

		this.client.games.set(message.channel.id, { name: this.name });

		const msg = await message.channel.send(embed);
		const reacted = await this.client.utils.promptMessage(msg, message.author, 30, chooseArr);
		const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];
		const result = getResult(reacted, botChoice);

		embed
			.setDescription('')
			.addField(result, `${reacted} vs ${botChoice}`);

		msg.edit(embed);
		this.client.games.delete(message.channel.id);

		function getResult(me, clientChosen) {
			if ((me === '🧱' && clientChosen === '✂️') ||
             (me === '📄' && clientChosen === '🧱') ||
             (me === '✂️' && clientChosen === '📄')) {
				return 'Aw shucks, you win!';
			} else if (me === clientChosen) {
				return 'Its a tie! Wanna play again?';
			} else {
				return 'I won! Better luck next time!';
			}
		}
	}

};
