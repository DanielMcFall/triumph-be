# Triumph-be
This is a work in progress. The goal of this repository is to collect data from the Riot API, transform it, and then present nicely formatted data for the front-end.

## Getting Started
This repository will not run unless a MongoDB server is running on `localhost:27017`.

* `$ git clone https://github.com/rinkelm/triumph-be.git`
* `$ npm install`
* Add your API key to `helpers/LeagueApiInit.js`
* `$ npm start`
* Navigate to a route

# Routes
`localhost:3005/summoner/profile/:region/:summonerName`
`localhost:3005/summoner/matches/:region/:accountId`
