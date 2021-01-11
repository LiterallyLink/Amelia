/* eslint-disable consistent-return */
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { inspect } = require('util');
const { Type } = require('@extreme_hero/deeptype');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['e'],
			description: 'Evaluates code.',
			category: 'Developer',
			usage: '<code>',
			ownerOnly: true
		});
	}

	async run(message, args) {
		const msg = message;
		if (!args.length) {
			const errEmbed = new MessageEmbed();
			return message.channel.send(errEmbed.setColor('RED').setDescription('`No code provided`'));
		}

		let code = args.join(' ');
		code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
		let evaled;
		try {
			const start = process.hrtime();
			evaled = eval(code);
			if (evaled instanceof Promise) {
				evaled = await evaled;
			}
			const stop = process.hrtime(start);

			const response = new MessageEmbed()
				.setColor('fce3b7')
				.setTitle('Evaluated')
				.setDescription(`:inbox_tray: **To Eval**\n\`\`\`${code}\`\`\` \n:outbox_tray: **Evaled** \n\`\`\`js\n${this.clean(inspect(evaled, { depth: 0 }))}\n\`\`\``)
				.addField('Type Of', `\`\`\`ts\n${new Type(evaled).is}\n\`\`\``)
				.addField(':stopwatch: Time Taken:', `\`\`\`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms\`\`\``);
			msg.channel.send(response);
		} catch (error) {
			const errorembed = new MessageEmbed()
				.setColor('RED')
				.setTitle('Error')
				.addField('Error', `${error}`);
			msg.channel.send(errorembed);
		}
	}

	clean(text) {
		if (typeof text === 'string') {
			text = text
				.replace(/`/g, `\`${String.fromCharCode(8202)}`)
				.replace(/@/g, `@${String.fromCharCode(8203)}`)
				.replace(new RegExp(this.client.token, 'gi'), '****');
		}
		return text;
	}

};

