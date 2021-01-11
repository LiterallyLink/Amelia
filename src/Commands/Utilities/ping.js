const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['p'],
			description: "Returns the bot's websocket latency and API latency",
			category: 'Utilities'
		});
	}

	async run(message) {
		const pinging = new MessageEmbed()
			.setDescription('Pinging...')
			.setColor('fce3b7');

		const msg = await message.channel.send(pinging);
		const latency = msg.createdTimestamp - message.createdTimestamp;

		const embed = new MessageEmbed()
			.setTitle('Pong!')
			.setDescription(`\nLatency is \`${latency}MS\`\nAPI Latency is \`${Math.round(this.client.ws.ping)}MS\``)
			.setColor('fce3b7');
		msg.edit({ embed });
	}

};
