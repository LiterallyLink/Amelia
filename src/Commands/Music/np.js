const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['nowplaying', 'current'],
			description: 'Provides the current song playing',
			category: 'Music',
			guildOnly: true
		});
	}

	async run(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		const pos = this.client.utils.formatMS(serverQueue.connection.dispatcher.streamTime);
		const { title, url, duration } = serverQueue.songs[0];

		const nowPlaying = (songDuration, position) => {
			const dashes = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
			const time = songDuration / 19;

			const pointer = Math.floor(position / time);

			const replacement = dashes.split('');
			replacement[pointer] = '<:bubba:794310661709496340>';

			const final = replacement.join('');
			return final;
		};

		if (!serverQueue) {
			return message.channel.send(new MessageEmbed().setColor('RED').setDescription('There must be playing a song to use this command.'));
		}

		return message.channel.send(new MessageEmbed()
			.setColor('fce3b7')
			.setDescription(`[${title}](${url})\n${nowPlaying(duration, serverQueue.connection.dispatcher.streamTime / 1000)} ${pos} / ${duration}`));
	}

};
