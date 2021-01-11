const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['user', 'ui', 'whois'],
			description: 'Displays role information.',
			category: 'Utilities',
			usage: '<roleID>',
			args: true,
			guildOnly: true
		});
	}

	async run(message, [mention]) {
		let role = message.guild.roles.cache.get(mention);

		if (message.mentions.roles.first()) {
			role = message.mentions.roles.first();
		} else {
			role = message.guild.roles.cache.find(roleInput => (roleInput.name === mention.toString()) || (roleInput.id === mention.toString()));
		}

		if (!role) {
			return message.channel.send(new MessageEmbed().setColor('RED').setDescription('Please provide a valid role'));
		}

		const permissions = this.client.utils.formatPerms(role.permissions);

		const roleEmbed = new MessageEmbed()
			.setDescription(stripIndents`__Information for role: <@&${role.id}>__
			\u200b
			**ID**: ${role.id}
			**Role Color**: ${role.hexColor}
			**Created At**: ${role.createdAt}
			**Position**: ${role.rawPosition + 1}
			**Managed**: ${role.managed ? '<:yes_:793655520967393290>' : '<:no_:793655520652820530>'}
			**Hoisted**: ${role.hoist ? '<:yes_:793655520967393290>' : '<:no_:793655520652820530>'}
			**Mentionable**: ${role.mentionable ? '<:yes_:793655520967393290>' : '<:no_:793655520652820530>'}
			**Permissions**: ${this.client.utils.capitalise(permissions)}`)
			.setColor('fce3b7');
		return message.channel.send(roleEmbed);
	}

};
