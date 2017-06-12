'use strict';
import apiInit from './leagueApiInit';
import handleErr from './error.js';

let leagueApi = apiInit();

let getMatches = (accountId, region) => {
  var championIds = [];
  return leagueApi.Matchlist.recent({accountId, region})
  .then((recentMatches) => {
    for (let match of recentMatches['matches']) {
      championIds.push(match.champion);
    }
    console.log(championIds);
    return getNewMatches(accountId, region, recentMatches);
  }).then((matches) => {
    let matchSummaries = [];
    for (let i in matches) {
      let match = matches[i];
      let championId = championIds[i];
      matchSummaries.push(createMatchSummary(match, championId));
    }
    return matchSummaries;
  }).catch(handleErr);
}

let getNewMatches = (accountId, region, matchList) => {
  let matchesToGet = [];
  for (let match of matchList['matches']) {
    let { gameId } = match;
    matchesToGet.push(leagueApi.Match.get({id: gameId, region}));
  }
  // Champion Id's are the only way to identify what champion a player
  // played in a normal game
  return Promise.all(matchesToGet);
}

let createMatchSummary = (match, championId) => {
  const { queueId, date, gameDuration, participants } = match;
  const wins = {
    100: (match.teams[0].win == 'Win') ? true : false,
    200: (match.teams[1].win == 'Win') ? true : false,
  }

  for (var participant of participants) {
    // The champion played is the only way to identify the player searched in normal games
    // Will be bugged if there's more than one player on a team with the same champion.
    if (participant.championId === championId) {
      break;
    }
  }

  const { stats } = participant;
  const {spell1Id, spell2Id } = participant;
  const { kills, deaths, assists, item0, item1, item2, item3, item4, item5, item6 } = participant.stats;
  const cs = stats.totalMinionsKilled + stats.neutralMinionsKilled;
  const damage = participant.stats.totalDamageDealtToChampions;
  const keystoneMastery = participant.masteries[5].masteryId;
  const win = wins[participant.teamId];
  let matchSummary = {
    queueId,
    date,
    gameDuration,
    win,
    spell1Id,
    spell2Id,
    championId,
    keystoneMastery,
    kills,
    deaths,
    assists,
    cs,
    item0,
    item1,
    item2,
    item3,
    item4,
    item5,
    item6,
    damage,
    triumphTier: 'Not Yet Implemented',
    triumphDivision: 'Not Yet Implemented',
    triumphScore: 'Not Yet Implemented',
  }
  console.log(matchSummary);
  return matchSummary;
}



module.exports = getMatches;
