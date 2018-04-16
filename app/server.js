import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongodb from 'mongodb';
import { calcDistance } from './distance.js';

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
  db.collection('trailNodes').find().toArray((err, result) => {
    res.send(result);
  });
});

app.get('/getTest', (req, res, next) => {
  db.collection('loc1').find().toArray((err, result) => {
    res.send(result);
  });
});

app.get('/getTrails', (req, res, next) => {
  db.collection('trailDataNH').find().toArray((err, result) => {
    res.send(result);
  });
});

app.get('/queryTrail/:lat/:lon/:radius', (req, res, next) => {
  const lat = parseFloat(req.params.lat, 10);
  const lon = parseFloat(req.params.lon, 10);
  const rad = parseInt(req.params.radius, 10);
  const milesInKM = 0.62137119;
  console.log(lat, lon, rad);
  const METERS_PER_MILE = 1609.34;
  db.collection('trailDataNH').find({
    geometry: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lat, lon],
        },
        $maxDistance: rad * METERS_PER_MILE,
      },
    },
  }).toArray((err, result) => {
    if (err) throw err;
    // console.log(result);
    const names = [];
    let i;
    for (i in result) {
      if (result[i].name) {
        // console.log(result[i].geometry.coordinates[0][0]);
        var distanceKM = 0;
        if (result[i].geometry.coordinates[0][0].length > 1) {
          console.log(result[i].geometry.coordinates[0][0][0], result[i].geometry.coordinates[0][0][1])
          distanceKM = calcDistance(result[i].geometry.coordinates[0][0][0], result[i].geometry.coordinates[0][0][1], lat, lon);
        }
        else {
          console.log(result[i].geometry.coordinates[0][0], result[i].geometry.coordinates[0][1])

          distanceKM = calcDistance(result[i].geometry.coordinates[0][0], result[i].geometry.coordinates[0][1], lat, lon);
        }
        // var distanceKM = calcDistance(result[i].geometry.coordinates[0][0], result[i].geometry.coordinates[0][1], lat, lon);
        console.log(distanceKM);
        var distanceMiles = milesInKM * distanceKM;
        names.push([result[i].name, distanceMiles]);
        // names.push(result[i].name);
      } 
    }
    res.send(names);
  });
});

app.get('/getTrail/:name', (req, res, next) => {
  const id = req.params.name;
  console.log(id.replace(/\-/g, ' '));
  db.collection('trailDataNH').findOne({ name: id.replace(/\-/g, ' ') }, (err, result) => {
    if (err) throw err;
    console.log(err);
    res.send(result);
    // db.close();
  });
});

app.get('/getNode/:nodeID', (req, res, next) => {
  const id = parseInt(req.params.nodeID, 10);
  console.log(id);
  db.collection('trailNodes').findOne({ nodeID: id }, (err, result) => {
    if (err) throw err;
    res.send(result);
    // db.close();
  });
});


app.get('/getAnnotation', (req, res, next) => {
  db.collection('annotation').find().toArray((err, result) => {
    res.send(result);
  });
});

app.post('/postNode', (req, res, next) => {
  const node = { lat: `${req.body.lat}`, lon: `${req.body.lon}`, nodeID: `${req.body.nodeID}` };
  db.collection('trailNodes').insertOne(node, (err, res) => {
    if (err) console.log(`error occured: ${err}`);
    else console.log(`${node} successfully posted`);
  });
});

app.post('/postTrail', (req, res, next) => {
  console.log(req);
  const node = {
    name: `${req.body.name}`,
    nodes: [],
    trailID: `${req.body.nodeID}`,
  };
  // db.collection('trails').insertOne(node, (err, res) => {
  //   if (err) console.log(`error occured: ${err}`);
  //   else console.log(`${node} successfully posted`);
  // });
});

// app.post('/postNodes', (req, res, next) => {
//   const node = { lat: `${req.body.lat}`, lon: `${req.body.lon}`, nodeID: `${req.body.nodeID}` };
//   db.collection('trailNode').insertMany(node, (err, res) => {
//     if (err) console.log(`error occured: ${err}`);
//     else console.log(`${node} successfully posted`);
//   });
// });

app.post('/postAnnotation', (req, res, next) => {
  const node = { type: `${req.body.type}`, text: `${req.body.text}` };
  db.collection('annotation').insertOne(node, (err, res) => {
    if (err) console.log(`error occured: ${err}`);
    else console.log(`${node} successfully posted`);
  });
});
// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
