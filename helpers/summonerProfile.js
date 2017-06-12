'use strict';
import summonerSchema from '../models/summoner.js';
import apiInit from './leagueApiInit';
import handleErr from './error';

let leagueApi = apiInit();

/**
 * Gets a summoners profile from the database or creates it if it doens't exist.
 * @param {string} name - summoner name (spacing and case insensitive)
 * @param {string} region - valid options: 'NA', 'EUW', 'EUNE', 'BR', 'LAN',
 *    'LAS', 'OCE', 'RU', 'TR' (case insensitive)
 * @return {promise} A promise for an object with a profile. See summoner model
**/
let getProfile = (name, region) => {
  return findSummonerByName(name, region)
  .then((profile) => {
    if (!profile) {
      return createProfile(name, region);
    }
    return profile;
  }).then((profile) => {
    let timeSinceUpdate = Date.now() - profile['lastUpdate'];
    if (timeSinceUpdate > 4200 || !profile['lastUpdate']) {
      return updateProfile(profile);
    }
    return profile;
  }).catch(handleErr);
}

/**
 * Gets summoner information
 * @param {string} name - summoner name (spacing and case insensitive)
 * @param {string} region - valid options: 'NA', 'EUW', 'EUNE', 'BR', 'LAN',
 *    'LAS', 'OCE', 'RU', 'TR' (case insensitive)
 * @return {promise} A promise for an object with this information:
 * { 'name': string - Name is it appears in game
 *   'nameStandard': string - Name in lower case and no spaces
 *   'region': string
 *   'summonerId': number
 *   'level': number
 * }
**/
let createProfile = (name, region) => {
  return leagueApi.Summoner.get({name, region})
  .then((summoner) => {
    const {name, id, accountId, summonerLevel } = summoner;
    let nameStandard = name.toLowerCase().replace(/ /g,'');
    let profile = {
      name,
      'nameStandard': nameStandard,
      region,
      summonerId: id,
      accountId,
      summonerLevel
    };

    return profile;
  }).catch(handleErr);
}

let findSummonerByName = (name, region) => {
  let nameStandard =  name.toLowerCase().replace(/ /g,''); //also has no spaces

  return summonerSchema.findOne( {'region': region, 'nameStandard': nameStandard})
  .catch(handleErr);
}

/**
 * Updates a profile with the 10 most recent matches, league info, and champion
 * mastery.
 * @param {object} profile - a summoner's profile
 * @param {string} profile.name - a summoner's name as it appears in game
 * @param {string} profile.nameStandard - name with spaces removed and all lower case
 * @param {string} profile.region  valid options: 'NA', 'EUW', 'EUNE', 'BR', 'LAN',
 *    'LAS', 'OCE', 'RU', 'TR' (case insensitive)
 * @param {number} profile.summonerId - a summoner's id
 * @param {number} profile.level
 * Profile may contain more fields, but are the rest will be updated if omitted.
 * @return {promise} A promise for an updated profile object. See summoner model
 *
**/
function updateProfile(profile) {
  profile['lastUpdate'] = Date.now();

  return updateMostPlayedChampion(profile)
  .then(updateLeague)
  .then(saveProfile)
  .catch(handleErr);
}

function updateMostPlayedChampion(profile) {
  const { accountId } = profile;

  return leagueApi.ChampionMastery.all({accId: accountId, name: profile.name})
  .then((champions) => {
    profile['mostPlayedChampion'] = champions[0]['championId'];
    return profile;
  }).catch(handleErr);
}

function updateLeague(profile) {
  const { region } = profile;
  return leagueApi.League.positions({id: profile['summonerId'], region})
  .then((league) => {
    let leagueRanks = [];
    for (let entry of league) {
      let { queueType, tier, rank, leaguePoints } = entry;
      leagueRanks.push({
        queueType,
        tier,
        division: rank,
        leaguePoints
      });
    }
    profile['leagueRanks'] = leagueRanks;
    return profile;
  }).catch((err) => {
    if (err.message == 'Error getting league data: 404 Not Found') {
      return profile;
    }
    else {
      handleErr(err);
    }
  });
}

function saveProfile(profile) {
  const { summonerId, region } = profile;
  let filter = {
    summonerId,
    region
  };
  return summonerSchema.findOne(filter)
    .then((existingProfile) => {
      if (!existingProfile) {
        let newProfile = new summonerSchema(profile);
        newProfile.save().catch(handleErr);
        return newProfile;
      } else {
        summonerSchema.update(existingProfile, profile).catch(handleErr);
      }
      return profile;
    }).catch(handleErr);
}



module.exports.getProfile = getProfile;
