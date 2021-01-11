const { Client, Collection, Permissions } = require('discord.js');
const Util = require('./Util.js');
const Economy = require('./Economy.js');

module.exports = class AmeliaClient extends Client {


	constructor(options = {}) {
		super({
			disableMentions: 'everyone'
		});
		this.validate(options);

		this.commands = new Collection();

		this.aliases = new Collection();

		this.events = new Collection();

		this.games = new Collection();

		this.snipes = new Collection();

		this.utils = new Util(this);

		this.economy = new Economy(this);

		this.owners = options.owners;

		this.buckets = new Map();

		this.queue = new Map();

		this.mongoose = require('./Mongo');
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		if (!options.token) throw new Error('You must pass the token for the client.');
		this.token = options.token;

		if (!options.prefix) throw new Error('You must pass a prefix for the client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.prefix = options.prefix;

		if (!options.defaultPerms) throw new Error('You must pass default perm(s) for the Client.');
		this.defaultPerms = new Permissions(options.defaultPerms).freeze();
	}

	async start(token = this.token) {
		this.utils.loadCommands();
		this.utils.loadEvents();
		this.mongoose.init();

		await super.login(token);
	}

};
