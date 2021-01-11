const AmeliaClient = require('./Structures/AmeliaClient');
const config = require('../config.json');

const client = new AmeliaClient(config);
client.start();
