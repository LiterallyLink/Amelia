const Event = require('../../Structures/Event');
const GuildSchema = require('../../Models/guildSchema.js');
const mongoose = require('mongoose');


module.exports = class extends Event {

	async run(guild) {
		const existingGuild = await GuildSchema.findOne({ guildID: guild.id });

		if (existingGuild) {
			return;
		}

		const newGuild = new GuildSchema({
			// eslint-disable-next-line new-cap
			_id: mongoose.Types.ObjectId(),
			guildID: guild.id,
			guildName: guild.name,
			prefix: '!',
			xp: false,
			levelUpMsg: false,
			eco: false
		});

		newGuild.save()
			.then(result => console.log(result))
			.catch(err => console.error(err));
	}

};
