'use strict';
import mongoose from 'mongoose';

var summonerSchema = new mongoose.Schema({
    'name': String,
    'nameStandard': String,
    'accountId': Number,
    'summonerId': Number,
    'region': String,
    'summonerLevel': {type: Number, default: 30},
    'lastUpdate':{type: Date, default: 0 },
    'triumphScore': Number,
    'leagueRanks': [{
        '_id': false,
        'queueType': String,
        'tier': String,
        'division': String,
        'leaguePoints': Number
    }],
    'mostPlayedChampion': Number
});

summonerSchema.index({'summonerId': 1, 'region': 1}, {unique: true});

let summoner = mongoose.model('summoner', summonerSchema);

module.exports = summoner;
