const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['snail'],
			description: 'An intense race between snails.',
			category: 'Fun',
			usage: '<number>'
		});
	}

	async run(message) {
		const current = this.client.games.get(message.channel.id);
		const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

		const distance = new Array(5);
		distance.fill('- - - - -');

		const raceBoard = new MessageEmbed()
			.setColor('fce3b7')
			.setDescription([
				`🏁 ${distance[0]} 🐌 **1.**`,
				`🏁 ${distance[1]} 🐌 **2.**`,
				`🏁 ${distance[2]} 🐌 **3.**`,
				`🏁 ${distance[3]} 🐌 **4.**`,
				`🏁 ${distance[4]} 🐌 **5.**`
			]);

		if (current) {
			message.reply(raceBoard.setColor('RED').setDescription(`Please wait until the current game of \`${current.name}\` is finished.`));
			return;
		}

		const msg = await message.channel.send(raceBoard);
		const raceFinished = (distanceLength) => distanceLength.length > 0;
		this.client.games.set(message.channel.id, { name: this.name });

		while (distance.every(raceFinished)) {
			for (let i = 0; i < 5; i++) {
				const random = Math.random() < 0.5 ? 0 : 2;
				const newString = distance[i].substring(0, distance[i].length - random);
				distance[i] = newString;
				const distanceSize = distance[i].replace(/\s+/g, '');

				if (distanceSize.length === 0) {
					continue;
				}
			}

			await sleep(2500);
			msg.edit(raceBoard.setDescription([
				`🏁 ${distance[0]} 🐌 **1.**`,
				`🏁 ${distance[1]} 🐌 **2.**`,
				`🏁 ${distance[2]} 🐌 **3.**`,
				`🏁 ${distance[3]} 🐌 **4.**`,
				`🏁 ${distance[4]} 🐌 **5.**`
			]));
		}
		this.client.games.delete(message.channel.id);
	}

};
