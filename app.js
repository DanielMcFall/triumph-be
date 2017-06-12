'use strict';
import express from 'express';
import mongoose from 'mongoose';
import summonerProfile  from './controllers/summonerProfile';
import summonerMatches from './controllers/summonerMatches';
import { json } from 'body-parser';

let app = express();

app.use(json());

//Mongo Connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/triumph');
let db = mongoose.connection;

db.on('error', function(err){
	console.error('connection error:', err);
});
db.once('open', function(){
  console.log('MongoDB connection success.');
});

app.use('/summoner/profile', summonerProfile);
app.use('/summoner/matches', summonerMatches);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error Handler
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

let port = process.env.port || 3005;

app.listen(port, function () {
  console.log('Triumph-be server is listening on port', port);
});
