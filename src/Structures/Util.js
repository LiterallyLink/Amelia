/* eslint-disable consistent-return */
const Command = require('./Command.js');
const Event = require('./Event.js');
const { MessageEmbed } = require('discord.js');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const mongoose = require('mongoose');
const guildSchema = require('../Models/guildSchema.js');

module.exports = class Util {

	constructor(client) {
		this.client = client;
	}

	isClass(input) {
		return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	removeDuplicates(arr) {
		return [...new Set(arr)];
	}

	// eslint-disable-next-line consistent-return
	weightedRandom(prob) {
		let i, sum = 0;
		const randomValue = Math.random();
		for (i in prob) {
			sum += prob[i];
			if (randomValue <= sum) return i;
		}
	}

	capitalise(string) {
		return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
	}

	lowercase(string) {
		return string.charAt(0) + string.substring(1).toLowerCase();
	}

	async canModifyQueue(member) {
		const resultsEmbed = new MessageEmbed()
			.setTitle('You must be in the same voice channel as me to use this command.')
			.setColor('RED');

		if (member.voice.channel !== member.guild.me.voice.channel) {
			member.send(resultsEmbed);
			return false;
		}
		return true;
	}

	checkOwner(target) {
		return this.client.owners.includes(target.id);
	}

	comparePerms(member, target) {
		return member.roles.highest.position < target.roles.highest.position;
	}

	getRole(role, guild) {
		if (!role) return null;

		if (/^[0-9]+$/.test(role)) {
			return guild.roles.cache.get(role);
		} else if (/^<@&[0-9]+>$/.test(role)) {
			const id = role.substring(3, role.length - 1);
			return guild.roles.cache.get(id);
		}

		return guild.roles.cache.find(mention => mention.name.toLowerCase() === role.toLowerCase());
	}

	getChannel(ch, guild) {
		if (!ch) return null;

		if (/^[0-9]+$/.test(ch)) {
			const channel = guild.channels.cache.get(ch);
			if (!channel || ['dm', 'voice', 'category', 'store'].includes(channel.type)) return;
			return channel;
		} else if (/^<#[0-9]+>$/.test(ch)) {
			const id = ch.substring(2, ch.length - 1);
			const channel = guild.channels.cache.get(id);
			if (!channel || ['dm', 'voice', 'category', 'store'].includes(channel.type)) return;
			return channel;
		}

		return guild.channels.cache.find(channel => (channel.type === 'text') && channel.name.toLowerCase() === ch);
	}

	formatNumber(num) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	}

	isWhole(num) {
		return /^\d+$/.test(num);
	}

	formatTime(secNum) {
		const time = new Date(secNum * 1000).toISOString().substr(11, 8);
		return time;
	}

	formatMS(milliseconds) {
		const totalSeconds = milliseconds / 1000;
		const hr = (totalSeconds % 86400) / 3600;
		const min = (totalSeconds % 3600) / 60;
		const sec = totalSeconds % 60;
		const ms = milliseconds % 1000;

		return (hr > 1 ? `${Math.floor(hr)}h ` : '') + (min > 1 ? `${Math.floor(min)}m ` : '') + ((min === 0) || sec > 1 || ms > 0 ? `${Math.floor(sec)}s` : '');
	}

	formatPerms(perm) {
		return perm
			.toArray()
			.join(', ')
			.toLowerCase()
			.replace(/_/g, ' ')
			.replace(/Guild/g, 'Server')
			.replace(/Use Vad/g, 'Use Voice Activity');
	}

	formatPermissions(perm) {
		return perm
			.toLowerCase()
			.replace(/(^|"|_)(\S)/g, (letter) => letter.toUpperCase())
			.replace(/_/g, ' ')
			.replace(/Guild/g, 'Server')
			.replace(/Use Vad/g, 'Use Voice Acitvity');
	}

	formatArray(array, type = 'conjunction') {
		return new Intl.ListFormat('en-GB', {
			style: 'short',
			type: type
		}).format(array);
	}

	shuffle(array) {
		const arr = array.slice(0);
		for (let i = arr.length - 1; i >= 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
		return arr;
	}

	randomRange(max) {
		return Math.floor(Math.random() * max) + 1;
	}

	async promptMessage(message, author, time, validReactions) {
		time *= 1000;

		for (const reaction of validReactions) await message.react(reaction);
		const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
		return message
			.awaitReactions(filter, {
				max: 1,
				time: time
			})
			.then(collected => collected.first() && collected.first().emoji.name);
	}

	getMember(message, toFind = '') {
		toFind = toFind.toLowerCase();

		let target = message.guild.members.cache.get(toFind);

		if (!toFind) {
			target = message.member;
		}

		if (!target && message.mentions.members) {
			target = message.mentions.members.first();
		}

		if (!target && toFind) {
			target = message.guild.members.cache.find(member => member.displayName.toLowerCase() === toFind || member.user.tag.toLowerCase() === toFind);
		}

		if (!target) {
			return message.channel.send({
				embed: {
					description: '<:fail:788336644792254484> Please provide a valid mention, name, or tag.',
					color: 'RED'
				}
			});
		}

		return target;
	}

	timeout(userId, commandName) {
		return () => {
			const bucket = this.client.buckets.get(`${userId}-${commandName}`);
			if (bucket && bucket.timeout) {
				this.client.clearTimeout(bucket.timeout);
			}

			this.client.buckets.delete(`${userId}-${commandName}`);
		};
	}

	runLimits(message, command) {
		const tout = this.timeout(message.author.id, command.name);

		let bucket = this.client.buckets.get(`${message.author.id}-${command.name}`);
		if (!bucket) {
			bucket = {
				reset: command.ratelimit.reset,
				remaining: command.ratelimit.bucket,
				timeout: this.client.setTimeout(tout, command.ratelimit.reset)
			};

			this.client.buckets.set(`${message.author.id}-${command.name}`, bucket);
		}

		if (bucket.remaining === 0) {
			if (command.ratelimit.stack) {
				if (bucket.limited) {
					if (bucket.timeout) {
						this.client.clearTimeout(bucket.timeout);
					}

					bucket.reset = (bucket.resetsIn - Date.now()) + command.ratelimit.reset;
					bucket.timeout = this.client.setTimeout(tout, bucket.reset);
					bucket.resetsIn = Date.now() + bucket.reset;
				}

				bucket.limited = true;
			}

			if (!bucket.resetsIn) {
				bucket.resetsIn = Date.now() + bucket.reset;
			}

			return bucket.resetsIn;
		}

		--bucket.remaining;
		return null;
	}

	async guildSchemaCreate(guild) {
		await guildSchema.findOne({
			guildID: guild.id
		}, (err, server) => {
			if (err) console.error(err);
			if (!server) {
				// eslint-disable-next-line new-cap
				const newGuild = new guildSchema({
					// eslint-disable-next-line new-cap
					_id: mongoose.Types.ObjectId(),
					guildID: server.id,
					guildName: server.name,
					prefix: this.client.prefix,
					xp: false,
					levelUpMsg: false,
					eco: false
				});

				newGuild.save()
					.then(result => console.log(result))
					.catch(error => console.error(error));
			}
		});
	}

	async loadCommands() {
		return glob(`${this.directory}commands/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new TypeError(`Comamnd ${name} doesnt belong in Commands.`);
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
		});
	}

	async loadEvents() {
		return glob(`${this.directory}events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](name, (...args) => event.run(...args));
			}
		});
	}

};
