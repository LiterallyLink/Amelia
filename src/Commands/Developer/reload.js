const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			category: 'Developer',
			description: 'Reloads a specified command.',
			usage: '<command>',
			ownerOnly: true
		});
	}

	async run(message, args) {
		if (!args[0]) {
			const noCMD = new MessageEmbed()
				.setColor('RED')
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setDescription(`Please enter the command name for reload!`)
				.setTimestamp();
			return message.channel.send(noCMD);
		}

		const cmd = args[0].toLowerCase();

		const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd));

		if (command) {
			delete require.cache[require.resolve(`../${command.category}/${ucFirst(command.name)}.js`)];

			const File = require(`../${command.category}/${ucFirst(command.name)}.js`);
			// eslint-disable-next-line no-shadow
			const Command = new File(this.client, command.name.toLowerCase());

			this.client.commands.delete(command.name);
			await this.client.commands.set(command.name, Command);

			const restartedCMD = new MessageEmbed()
				.setColor('DARK-BLUE')
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setDescription(`\`\`\`Command ${command.name} has been restarted!\`\`\``)
				.setTimestamp();
			return message.channel.send(restartedCMD);
		} else {
			const notFound = new MessageEmbed()
				.setColor('RED')
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setDescription(`\`\`\`Could not find command named ${cmd}!\`\`\``)
				.setTimestamp();
			return message.channel.send(notFound);
		}

		function ucFirst(str) {
			if (!str) return str;
			return str[0].toUpperCase() + str.slice(1);
		}
	}

};
