'use strict';
import mongoose from 'mongoose';

var matchSchema = new mongoose.Schema({
  'accountId': {type: Number, default: -1},
  'region': {type: String},
  'gameId': {type: Number, default: -1},
  'queueId': {type: String},
  'championId': {type: Number, default: -1},
  'date': {type: Date, default: Date.now},
  'win': {type: Boolean, default: false},
  'gameDuration': {type: Number, default: -1},
  'spell1Id': {type: Number, default: -1},
  'spell2Id': {type: Number, default: -1},
  'keystoneMastery': {type: Number, default: -1},
  'kills': {type: Number, default: -1},
  'deaths': {type: Number, default: -1},
  'assists': {type: Number, default: -1},
  'cs': {type: Number, default: -1},
  'item0': {type: Number, default: -1},
  'item1': {type: Number, default: -1},
  'item2': {type: Number, default: -1},
  'item3': {type: Number, default: -1},
  'item4': {type: Number, default: -1},
  'item5': {type: Number, default: -1},
  'item6': {type: Number, default: -1},
  'damage': {type: Number, default: -1},
  'triumphTier': {type: String},
  'triumphDivision': {type: Number},
  'triumphScore': {type: Number, default: -1}
});

matchSchema.index({'accountId': 1, 'region': 1, 'matchId': 1}, {unique: true});

let match = mongoose.model('match', matchSchema);

module.exports = match;
