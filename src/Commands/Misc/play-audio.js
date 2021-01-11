const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const audioPath = 'C:\\Users\\Zechariah\\Desktop\\Discord Bots\\Amelia\\assets\\audioFiles';
const files = fs.readdirSync(audioPath);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['audio'],
			description: 'Play an assortment of Amelia sounds and clips!.',
			category: 'Misc',
			usage: 'zoomer'
		});
	}

	async run(message, args) {
		const { voice } = message.member;
		const embed = new MessageEmbed();

		if (!voice.channelID) {
			message.channel.send(embed.setColor('RED').setDescription('You must be in a voice channel to use this commmand.'));
			return;
		}

		if (!files.includes(`${args[0]}.mp3`.toLowerCase())) {
			message.channel.send(embed.setColor('fce3b7').setTitle('Valid AudioFiles').setDescription(`${files.join('\n')}`));
			return;
		}
		const connection = await voice.channel.join();
		const dispatcher = connection.play(`${audioPath}\\${args[0]}.mp3`);
		await connection.voice.setSelfDeaf(true); await connection.voice.setDeaf(true);

		dispatcher.on('start', () => undefined);

		dispatcher.on('finish', () => {
			connection.disconnect();
		});
	}

};
