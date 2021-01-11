const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const weather = require('weather-js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Fetch the weather in realtime.',
			category: 'Misc',
			usage: 'California',
			args: true
		});
	}

	async run(message, args) {
		weather.find({ search: args.join(' '), degreeType: 'F' }, (error, result) => {
			if (error) return message.channel.send(error);

			if (result === undefined || result.length === 0) return message.channel.send('**Invalid** location');

			const { current } = result[0];
			const { location } = result[0];

			const weatherinfo = new MessageEmbed()
				.setDescription(`**${current.skytext}**`)
				.setAuthor(`Weather forecast for ${current.observationpoint}`)
				.setThumbnail(current.imageUrl)
				.setColor('fce3b7')
				.addField('Timezone', `UTC${location.timezone}`, true)
				.addField('Degree Type', 'Celsius', true)
				.addField('Temperature', `${current.temperature}°`, true)
				.addField('Wind', current.winddisplay, true)
				.addField('Feels like', `${current.feelslike}°`, true)
				.addField('Humidity', `${current.humidity}%`, true)
				.setTimestamp();

			return message.channel.send(weatherinfo);
		});
	}

};
