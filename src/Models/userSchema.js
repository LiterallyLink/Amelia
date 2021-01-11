/* eslint-disable new-cap */
const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true
};

const Schema = mongoose.Schema({
	User: reqString,
	Blacklist: Boolean
});

module.exports = mongoose.model('User', Schema);
