/* eslint-disable complexity */
const Event = require('../../Structures/Event');
const Levels = require('discord-xp');
const { MessageEmbed } = require('discord.js');
const guildSchema = require('../../Models/guildSchema.js');
const custom = require('../../Models/customCommand.js');
const userSchema = require('../../Models/userSchema.js');
const ms = require('ms');
const mongoURL = require('../../../config.json');

Levels.setURL(mongoURL.mongoPath);

module.exports = class extends Event {

	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);

		if (message.author.bot) return;

		this.client.utils.guildSchemaCreate(message.guild);
		const settings = await guildSchema.findOne({ guildID: message.guild.id });
		const prefix = message.guild ? settings.prefix : '!';

		if (message.content.match(mentionRegex) && message.guild) message.channel.send(`My prefix for ${message.guild.name} is \`${prefix}\`.`);

		if (message.guild && !message.content.startsWith(prefix) && settings.xp) {
			const randomXp = Math.floor(Math.random() * 29) + 1;
			const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);

			if (hasLeveledUp && settings.levelUpMsg) {
				const user = await Levels.fetch(message.author.id, message.guild.id);
				message.channel.send(`${message.author} has leveled up to level ${user.level}!`);
			}
		}

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

		if (!command) {
			custom.findOne({
				guildID: message.guild.id,
				Command: message.content.slice(prefix.length)
			},
			async (err, data) => {
				if (err) throw err;
				if (data) message.channel.send(data.Content);
				return;
			});
		}

		if (command) {
			const userData = await userSchema.findOne({ userSchema: message.author.id });

			if (userData && userData.Blacklist && !this.client.utils.checkOwner(message.author)) {
				return;
			}

			if (command.ownerOnly && !this.client.utils.checkOwner(message.author)) {
				return;
			}

			if (command.guildOnly && !message.guild) {
				return;
			}

			if (command.args && !args.length) {
				message.channel.send(new MessageEmbed()
					.setAuthor(`${message.author.username}`, message.member.user.displayAvatarURL({ size: 4096, dynamic: true }))
					.setColor('fce3b7')
					.setDescription(`<:fail:788336644792254484> Lack of arguments given.\n** **\nUsage: \`${command.usage}\``));
				return;
			}

			if (!this.client.owners.includes(message.author.id)) {
				let remaining = await this.client.utils.runLimits(message, command);
				if (remaining) {
					remaining = ms(remaining - Date.now(), { long: true });
					message.channel.send(`Sorry **${message.author}**, you have to wait **${remaining}** before running this command.`);
					return;
				}
			}

			if (message.guild) {
				const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
				if (userPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
					if (missing.length) {
						message.reply(`You are missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPermissions))} permissions, you need them to use this command!`);
						return;
					}
				}

				const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPerms;
				if (botPermCheck) {
					const missing = message.channel.permissionsFor(this.client.user).missing(botPermCheck);
					if (missing.length) {
						message.reply(`I am missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPermissions))} permissions, I need them to run this command!`);
						return;
					}
				}
			}

			command.run(message, args);
		}
	}

};
