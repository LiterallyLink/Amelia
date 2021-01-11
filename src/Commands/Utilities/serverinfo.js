const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
	brazil: 'Brazil :flag_br:',
	europe: 'Europe :flag_eu:',
	hongkong: 'Hong Kong :flag_hk:',
	india: 'India :flag_in:',
	japan: 'Japan :flag_jp:',
	russia: 'Russia :flag_si:',
	singapore: 'Singapore  :flag_sg: ',
	southafrica: 'South Africa',
	sydney: 'Sydney :flag_se: :flag_za:',
	usCentral: 'US Central :flag_us:',
	'us-east': 'US East :flag_us:',
	'us-west': 'US West :flag_us:',
	'us-south': 'US South :flag_us:'
};

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['guildinfo', 'sinfo'],
			description: 'Retrieves extensive information on the server.',
			category: 'Utilities',
			guildOnly: true
		});
	}

	async run(message) {
		const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
		const members = message.guild.members.cache;
		const channels = message.guild.channels.cache;
		const emojis = message.guild.emojis.cache;
		const channelCount = channels.size;
		const totalMembers = message.guild.memberCount;
		const totalChannels = channels.filter(re => re.type === 'text').size;
		const totalVCs = channels.filter(re => re.type === 'voice').size;
		const totalCategories = channels.filter(re => re.type === 'category').size;

		const embed = new MessageEmbed()
			.setAuthor(`${message.guild.name}`, message.guild.iconURL())
			.setColor('fce3b7')
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.addField('General Server Info', [
				`**Owner:** ${message.guild.owner.user}`,
				`**Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
				`**Partnered:** ${message.guild.partnered ? 'True' : 'False'}`,
				`**Guild ID:** ${message.guild.id}`,
				`**Server Icon:** [URL](${message.guild.iconURL()})`,
				`**Server Region:** ${regions[message.guild.region]}`,
				`**Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
				`**Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
				'\u200b'
			])
			.addField('Server Statistics', [
				`**Role Count:** ${roles.length}`,
				`**Emoji Count [${emojis.size}]:** \n•Static: ${emojis.filter(emoji => !emoji.animated).size}\n•Animated: ${emojis.filter(emoji => emoji.animated).size}`,
				`**Member Count [${totalMembers}]:**\n• Humans: ${members.filter(member => !member.user.bot).size}\n• Bots: ${members.filter(member => member.user.bot).size}`,
				`**Channels [${channelCount}]:**
				\n•<:category:761454170511114271> Categories: ${totalCategories}\n•<:text:761453638970245130> Text Channels: ${totalChannels}\n•<:voice:761453638810992641> Voice Channels: ${totalVCs}`,
				'\u200b'
			])
			.addField('Server Boost', [
				`**<:boost:724528574823923783> Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
				`** Boost Count:** ${message.guild.premiumSubscriptionCount}` || 0
			])
			.addField('User Presence', [
				`**<:Online:724830708937261088> Online:** ${members.filter(member => member.presence.status === 'online').size}`,
				`**<:Idle:724830709021278289> Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
				`**<:DnD:724830708937261057> Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
				`**<:streaming:725438610865913858> Streaming:** ${members.filter(member => member.presence.status === 'streaming').size}`,
				`**<:Offline:724832757473214484> Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
				'\u200b'
			]);
		message.channel.send(embed);
	}

};

