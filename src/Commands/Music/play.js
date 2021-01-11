const Command = require('../../Structures/Command');
const ytdl = require('ytdl-core');
const ytsr = require('youtube-sr');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Plays',
			category: 'Music',
			usage: '<youtube url>',
			botPerms: ['SPEAK', 'CONNECT'],
			args: true,
			guildOnly: true
		});
	}

	async run(message, args) {
		const { channel } = message.member.voice;

		if (!channel) {
			message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
			return;
		}

		const search = args.join(' ');
		const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
		const urlValid = videoPattern.test(args[0]);

		let songInfo = null;
		let song = null;

		if (urlValid) {
			try {
				songInfo = await ytsr.searchOne(search);
				song = {
					title: songInfo.title,
					author: songInfo.channel.name,
					url: songInfo.url,
					thumbnail: songInfo.thumbnail.url,
					duration: songInfo.durationFormatted
				};
			} catch (error) {
				console.error(error);
			}
		} else {
			try {
				songInfo = await ytsr.searchOne(search);
				song = {
					title: songInfo.title,
					author: songInfo.channel.author,
					url: songInfo.url,
					thumbnail: songInfo.thumbnail.url,
					duration: songInfo.durationFormatted
				};
			} catch (error) {
				console.error(error);
			}
		}

		const serverQueue = message.client.queue.get(message.guild.id);

		if (serverQueue) {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs.map(music => music.duration));
			message.channel.send(new MessageEmbed()
				.setAuthor(`Added to queue`, message.author.displayAvatarURL())
				.setDescription(`[${song.title}](${song.url})`)
				.addFields(
					{ name: 'Channel', value: song.author },
					{ name: 'Song Duration', value: song.duration },
					{ name: 'Estimated time until playing', value: 'a' },
					{ name: 'Queue Position', value: serverQueue.songs.length }
				)
				.setThumbnail(song.thumbnail)
				.setColor('fce3b7')
			);
			return;
		}

		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: channel,
			connection: null,
			songs: [],
			loop: false,
			filters: [],
			volume: 2,
			playing: true
		};
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		// eslint-disable-next-line no-shadow
		const play = async song => {
			const queue = message.client.queue.get(message.guild.id);
			if (!song) {
				queue.voiceChannel.leave();
				message.client.queue.delete(message.guild.id);
				return;
			}

			const dispatcher = queue.connection.play(ytdl(song.url))
				.on('finish', () => {
					if (queue.loop) {
						const lastSong = queue.songs.shift();
						queue.songs.push(lastSong);
						play(queue.songs[0]);
					} else {
						queue.songs.shift();
						play(queue.songs[0]);
					}
				})
				.on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(queue.volume / 5);
			queue.textChannel.send(`🎶 Playing **${song.title}** - Now!`);
		};

		try {
			const connection = await channel.join();
			if (!this.client.utils.canModifyQueue(message.member)) return;

			queueConstruct.connection = connection;
			play(queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			message.client.queue.delete(message.guild.id);
			await channel.leave();
			message.channel.send(`I could not join the voice channel: ${error}`);
			return;
		}
	}

};
