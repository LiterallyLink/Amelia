const { Schema, model } = require('mongoose');
module.exports = model(
	'customCommand',
	new Schema({
		guildID: String,
		Command: String,
		Content: String
	})
);
