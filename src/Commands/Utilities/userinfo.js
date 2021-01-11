const Command = require('../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const flags = {
	DISCORD_EMPLOYEE: '<:DiscordStaff:724745912609407028>',
	DISCORD_PARTNER: '<:DiscordPartner:724856585402187806>',
	BUGHUNTER_LEVEL_1: '<:BugHunterLevel1:724745801544499250>',
	BUGHUNTER_LEVEL_2: '<:BugHunterLevel2:724830709059027014>',
	HYPESQUAD_EVENTS: '<:HypeSquadEvents:724745841729863771>',
	HOUSE_BRAVERY: '<:BraveryLogo:724737664133103668>',
	HOUSE_BRILLIANCE: '<:BrillianceLogo:724735690054828072>',
	HOUSE_BALANCE: '<:BalanceLogo:724536869689491466>',
	EARLY_SUPPORTER: '<:EarlySupporter:724760903681048607>',
	TEAM_USER: 'Team User',
	SYSTEM: '<:system:762128454354206732>',
	VERIFIED_BOT: '<:bot:762125324430475306>',
	VERIFIED_DEVELOPER: '<:VerifiedDev:724757002160570369>'
};

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['user', 'ui', 'who'],
			description: 'Returns detailed information on a specificed user.',
			category: 'Utilities',
			usage: '<user>, userinfo <ID>, userinfo <nickname>',
			guildOnly: true
		});
	}

	async run(message, [target]) {
		const member = this.client.utils.getMember(message, target);

		if (!member) {
			return;
		}

		const userFlags = member.user.flags ? member.user.flags.toArray() : [];
		const roles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(role => role.toString())
			.slice(0, -1);

		const embed = new MessageEmbed()
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setColor(member.displayHexColor || 'fce3b7')
			.addField('User', [
				`• **Username:** ${member.user.username}`,
				`• **Discriminator:** ${member.user.discriminator}`,
				`• **ID:** ${member.id}`,
				`• **Flags:** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
				`• **Avatar:** [Avatar Link](${member.user.displayAvatarURL({ dynamic: true })})`,
				`• **Time Created:** ${moment.utc(member.user.createdAt).format('MM/DD/YYYY h:mm A')} ${moment(member.user.createdTimestamp).fromNow()}`,
				`• **User Presence:** ${this.client.utils.capitalise(member.presence.status)}`,
				`• **Game:**`,
				'\u200b'
			])
			.addField('Member', [
				`• **Highest Role:** ${member.roles.highest.id === member.guild.id ? 'None' : member.roles.highest.name}`,
				`• **Server Join Date:** ${moment(member.joinedAt).format('LL LTS')}`,
				`• **Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
				`• **Roles [${roles.length}]:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None'}`,
				'\u200b'
			]);
		message.channel.send(embed);
	}

};
