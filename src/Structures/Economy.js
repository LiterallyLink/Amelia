const Profile = require('../Models/profileSchema');

module.exports = class Economy {

	constructor(client) {
		this.client = client;
	}

	async getCredits(guildID, userID) {
		const wallet = await Profile.findOne({ guildId: guildID, userId: userID });
		let credits = 0;

		if (wallet) {
			// eslint-disable-next-line prefer-destructuring
			credits = wallet.credits;
		} else {
			const newData = new Profile({
				guildId: guildID,
				userId: userID,
				credits: credits
			});

			await newData.save()
				.catch(err => console.log(err));
		}

		return credits;
	}


	async addCredits(guildID, userID, credits) {
		const result = await Profile.findOneAndUpdate({ guildId: guildID, userId: userID },
			{
				guildId: guildID,
				userId: userID,
				$inc: {
					credits
				}
			},
			{
				upsert: true,
				new: true,
				useFindAndModify: false
			}
		);
		return result.credits;
	}

	async setCredits(guildId, userId, credits) {
		const bal = await this.getCredits(guildId, userId);
		await this.addCredits(guildId, userId, -bal);
		const newBal = await this.addCredits(guildId, userId, credits);
		return newBal;
	}

	async fetchLeaderboard(guildId, limit) {
		var users = await Profile.find({ guildId: guildId }).sort([['credits', 'descending']]).exec();

		return users.slice(0, limit);
	}

};
