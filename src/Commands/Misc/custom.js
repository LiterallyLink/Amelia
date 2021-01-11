/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const Custom = require('../../Models/customCommand.js');
const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['cc'],
			category: 'Misc',
			description: 'Create a custom bot response.',
			usage: '<command name> <response>',
			guildOnly: true
		});
	}

	async run(message, args) {
		const embed = new MessageEmbed();
		const listArray = [];
		const customSearch = await Custom.find({
			guildID: message.guild.id
		});

		for (const list of customSearch) {
			const { Command } = list;
			listArray.push(`\`${Command}\``);
		}

		if (!args[0]) {
			return message.channel.send(embed
				.setAuthor(`Custom Commands - ${message.guild.name}`, this.client.user.displayAvatarURL())
				.setColor('fce3b7')
				.setDescription(listArray.join(' ')).setFooter(`Total Custom Commands: ${listArray.length}`));
		} else if (!args[1] || args[1].length > 100) {
			return message.channel.send(embed.setColor(0xff0000).setDescription('`Please provide a valid response.`').setFooter('Responses may only be a total of 100 characters.'));
		}

		const customCommand = args[0].toLowerCase();
		const existingCmd = this.client.commands.get(customCommand) || this.client.commands.get(this.client.aliases.get(customCommand));

		if (existingCmd) {
			return message.channel.send(embed.setColor(0xff0000).setDescription(`${customCommand} is an already existing command. Please choose a different name for your custom command.`));
		}

		Custom.findOne(
			{ guildID: message.guild.id, Command: customCommand },
			async (err, data) => {
				if (err) throw err;
				if (data) {
					data.Content = args.slice(1).join(' ');
					data.save();

					message.channel.send(embed.setColor('fce3b7').setDescription(`Successfully updated the command \`${customCommand}\``)
					);
				} else if (!data) {
					const newData = new Custom({
						guildID: message.guild.id,
						Command: customCommand,
						Content: args.slice(1).join(' ')
					});
					newData.save();
					message.channel.send(embed.setColor('fce3b7').setDescription(`Successfully created the command \`${customCommand}\``));
				}
			});
	}

};
