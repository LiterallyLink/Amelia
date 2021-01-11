const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Decide your fate with the almighty 8ball!',
			usage: '<query>',
			category: 'Fun',
			args: true
		});
	}

	async run(message, args) {
		const RatingArray = ['🟢', '🟡', '🔴'];

		const Choices = [
			{ Rating: 0, Message: 'It is certain.' },
			{ Rating: 0, Message: 'It is decidedly so.' },
			{ Rating: 0, Message: 'Without a doubt.' },
			{ Rating: 0, Message: 'Yes - definitely.' },
			{ Rating: 0, Message: 'You may rely on it.' },
			{ Rating: 0, Message: 'As I see it, yes.' },
			{ Rating: 0, Message: 'Most likely.' },
			{ Rating: 0, Message: 'Outlook good.' },
			{ Rating: 0, Message: 'Yes.' },
			{ Rating: 0, Message: 'Signs point to: Yes.' },

			{ Rating: 1, Message: 'Reply hazy, try again later.' },
			{ Rating: 1, Message: 'Ask again later.' },
			{ Rating: 1, Message: 'Better not tell you now.' },
			{ Rating: 1, Message: 'Cannot predict now.' },
			{ Rating: 1, Message: 'Concentrate and ask again.' },

			{ Rating: 2, Message: "Don't count on it." },
			{ Rating: 2, Message: 'My sources say no.' },
			{ Rating: 2, Message: 'My reply is no.' },
			{ Rating: 2, Message: 'Outlook not so good.' },
			{ Rating: 2, Message: 'Very doubtful.' }
		];

		const Choice = Choices[Math.floor(Math.random() * Choices.length)];

		const Embed = new MessageEmbed()
			.setTitle('The 8-Ball has spoken!')
			.setColor(0xfce3b7)
			.setDescription(`\`\`${args.slice(0).join(' ')}\`\``)
			.addField('Answer', `\`\`${Choice.Message}\`\``)
			.addField('Rating', RatingArray[Choice.Rating])
			.setFooter(`Requested by ${message.member.user.tag}`);

		return message.channel.send(Embed);
	}

};
