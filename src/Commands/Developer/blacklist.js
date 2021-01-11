/* eslint-disable consistent-return */
const User = require('../../Models/userSchema');
const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			usage: '<User>',
			category: 'Developer',
			description: 'Blacklists a user from using the bot.',
			guildOnly: true,
			ownerOnly: true
		});
	}

	async run(message, args) {
		const user = this.client.users.cache.get(args[1]);
		const embed = new MessageEmbed()
			.setColor('fce3b7');

		if (!user) {
			return message.channel.send('You must input a **User ID**.');
		}

		const userData = await User.findOneAndUpdate({ User: user.id });

		if (!userData) {
			const newUserData = new User({
				User: user.id,
				Blacklist: true
			});
			newUserData.save();
			return message.channel.send(embed.setDescription('The user was **added** to the blacklist data.'));
		}

		if (args[0].toLowerCase() === 'add' && userData.Blacklist === false) {
			userData.Blacklist = true;
			userData.save();
			return message.channel.send(embed.setDescription('This user is now blacklisted.'));
		}

		if (args[0].toLowerCase() === 'remove' && userData.Blacklist === true) {
			userData.Blacklist = false;
			userData.save();
			return message.channel.send(embed.setDescription('The user is no longer blacklisted.'));
		}
	}

};
