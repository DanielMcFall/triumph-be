'use strict';
import KindredAPI from 'kindred-api';

const API_KEY = 'INSET_API_KEY';
const REGIONS = KindredAPI.REGIONS;
const LIMITS = KindredAPI.LIMITS;


let apiInit = () => {

  let leagueApi = new KindredAPI.Kindred({
    key: API_KEY,
    defaultRegion: REGIONS.NORTH_AMERICA,
    debug: true, // shows status code, urls, and relevant headers
    limits: LIMITS.PROD, // LIMITS.DEV for DEV :p
    spread: false,
    // put this if you want spread. Refer to `Rate Limiter` to kinda get a general overview of it.
    cacheTTL: {}
    // refer to `Caching` section to see how to pass in your own timers
  });

  return leagueApi;
}

module.exports = apiInit;
