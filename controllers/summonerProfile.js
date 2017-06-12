'use strict';
import express from 'express';
import summoner from '../helpers/summonerProfile';
let router = express.Router();

/**
GET /summoner/profile/:region/:name
Returns information about a summoners rank, match history, triumph score, and more.
**/
router.get('/:region/:name', (req, res) => {
  const region = req.params.region.toLowerCase();
  summoner.getProfile(req.params.name, region)
    .then( (profile) => {
      res.json(profile);
    }).catch( (err) => {
      console.log(err);
    });
});

module.exports = router;
