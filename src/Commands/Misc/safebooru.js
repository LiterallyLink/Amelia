/* eslint-disable max-len */
/* eslint-disable id-length */
const Command = require('../../Structures/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Responds with an image from Safebooru, with an optional query.',
			category: 'Misc',
			usage: 'Amelia_Watson'
		});
	}

	async run(message, [query]) {
		const embed = new MessageEmbed();
		const { text } = await request
			.get('https://safebooru.org/index.php')
			.query({
				page: 'dapi',
				s: 'post',
				q: 'index',
				json: 1,
				tags: query,
				limit: 200
			});

		if (!text) return message.channel.send(embed.setColor('RED').setDescription('Could not find any results.'));

		const body = JSON.parse(text);
		const data = body[Math.floor(Math.random() * body.length)];
		const link = `https://safebooru.org/images/${data.directory}/${data.image}`;
		return message.channel.send(embed.setColor('fce3b7').setImage(`${link}`).setDescription(`[Image URL](${link})`));
	}

};
