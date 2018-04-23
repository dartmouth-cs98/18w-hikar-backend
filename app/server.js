import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongodb from 'mongodb';
import mongoose from 'mongoose';
import { calcDistance } from './distance.js';
import apiRouter from './router';

// initialize
const app = express();
// const MongoClient = mongodb.MongoClient;

const uri = 'mongodb://hikar_db:hikar@ds221258.mlab.com:21258/hikar';

mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongoose connected');
});
// enable/disable cross origin resource sharing if necessary
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('static'));
// enables static assets from folder static
app.set('views', path.join(__dirname, '../app/views'));
// this just allows us to render ejs from the ../app/views directory

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', apiRouter);

// default index route
app.get('/', (req, res, next) => {
  res.send('Welcome to the HikAR server');
});
//
// app.get('/getAnnotation', (req, res, next) => {
//   db.collection('annotation').find().toArray((err, result) => {
//     res.send(result);
//   });
// });


// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
