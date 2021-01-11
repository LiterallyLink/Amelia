/* eslint-disable new-cap */
const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	guildName: String,
	prefix: { type: String, default: '!' },
	xp: { type: Boolean, default: false },
	levelUpMsg: { type: Boolean, default: false },
	eco: { type: Boolean, default: false }
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');
