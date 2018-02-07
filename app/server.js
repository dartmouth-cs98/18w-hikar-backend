import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongodb from 'mongodb';

// initialize
const app = express();
const MongoClient = mongodb.MongoClient;

const uri = 'mongodb://hikar_db:hikar@ds221258.mlab.com:21258/hikar';
let db;
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

// init the connection
MongoClient.connect(uri, (err, database) => {
  db = database.db('hikar');
  if (db) {
    console.log('success');
  }
});
// default index route
app.get('/', (req, res, next) => {
  res.send('Welcome to the HikAR server');
});

app.get('/getNode', (req, res, next) => {
  db.collection('trailNode').find().toArray((err, result) => {
    res.send(result);
  });
});

app.get('/getAnnotation', (req, res, next) => {
  db.collection('annotation').find().toArray((err, result) => {
    res.send(result);
  });
});

app.post('/postNode', (req, res, next) => {
  console.log(req.body);
  console.log(req.body.lat);
  const node = { lat: `${req.body.lat}`, long: `${req.body.lon}` };
  db.collection('trailNode').insertOne(node, (err, res) => {
    if (err) console.log(`error occured: ${err}`);
    else console.log(`${node} successfully posted`);
  });
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
