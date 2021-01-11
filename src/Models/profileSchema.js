/* eslint-disable new-cap */
const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true
};

const profileSchema = mongoose.Schema({
	guildId: reqString,
	userId: reqString,
	credits: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('profile', profileSchema, 'profiles');
