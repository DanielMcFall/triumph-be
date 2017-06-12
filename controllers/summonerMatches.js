'use strict';
import express from 'express';
import getMatches from '../helpers/summonerMatches';
import handleErr from '../helpers/error';
let router = express.Router();

/**
GET /summoner/profile/:region/:accountId
Returns information about a summoners rank, match history, triumph score, and more.
**/
router.get('/:region/:accountId', (req, res) => {
  const accountId = parseInt(req.params.accountId);
  const region = req.params.region.toLowerCase();

  getMatches(accountId, region)
    .then((matches) => {
      res.json(matches);
    }).catch(handleErr);
});

module.exports = router;
