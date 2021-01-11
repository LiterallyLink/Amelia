/* eslint-disable new-cap */
const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true
};

const reqInteger = {
	type: Number,
	required: true
};

const profileSchema = mongoose.Schema({
	guildId: reqString,
	minXPGain: { reqInteger, default: 1 },
	maxXPGain: { reqInteger, default: 30 }

});

module.exports = mongoose.model('xpSetting', profileSchema, 'xpSettings');
