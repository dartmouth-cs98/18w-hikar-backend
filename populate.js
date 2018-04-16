const axios = require('axios');
const config = require('./export.json');
const geo = require('./export2.json');

const mongodb = require('mongodb');

// console.log(geo.features[0].properties.name);
console.log(geo.features[0].geometry.coordinates[0]);
// const fs = require('fs');


const elements = config.elements;
//
axios.get('http://localhost:9090/getnode/618924458').then((response) => {
  console.log(response.data);
});

const relationID = geo.features[0].id.replace(/[^\d.]/g, '');

function getObjects(obj, key, val) {
  let objects = [];
  for (const i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] === 'object') {
      objects = objects.concat(getObjects(obj[i], key, val));
    } else if (i == key && obj[key] == val) {
      objects.push(obj);
    }
  }
  return objects;
}

const data = {
  name: geo.features[0].properties.name,
  geometry: geo.features[0].geometry,
};

console.log(data);
const trails = [];
trails.push(data);


// for (i = 0; i < elements.length; i++) {
//   if (elements[i].type == 'relation') {
//     const nodes = [];
//     const ways = elements[i].members;
//     for (j = 0; j < ways.length; j++) {
//       // console.log();
//       const objs = getObjects(config, 'id', ways[j].ref);
//       for (node in objs[0].nodes) {
//         const nID = objs[0].nodes[node];
//         const objs2 = getObjects(config, 'id', nID);
//         // console.log(objs2[0].lat, nID);
//         const geo = [objs2[0].lat, objs2[0].lon];
//         nodes.push(geo);
//       }
//     }
//     // console.log(nodes);
//     const data = {
//       name: elements[i].tags.name,
//       relationID: elements[i].id,
//       TrailNodes: nodes,
//     };
//     // console.log(nodes[nodes.length / 2]);
//     trails.push(data);
//   }
// }

// console.log(trails[2]);

// console.log(relationID);


// const Arr = [];
// // console.log(elements.length);
// for (i = 0; i < elements.length; i++) {
//   if (elements[i].type == 'node') {
//     // console.log(elements[i]);
//     const params = {
//       nodeID: elements[i].id,
//       lat: elements[i].lat,
//       lon: elements[i].lon,
//     };
//     axios.post('http://localhost:9090/postNode', params).then((response) => {
//       console.log('Successfully posted');
//        // dispatch({ type: ActionTypes.AUTH_USER });
//     }).catch((error) => {
//       console.log(error);
//     });
//   }
// }


// const nodes = { nodes: Arr };

// console.log(Arr);

// axios.post('http://hikar.herokuapp.com/getNode', Arr).then((response) => {
//   console.log('Successfully posted');
//    // dispatch({ type: ActionTypes.AUTH_USER });
// }).catch((error) => {
//   console.log(error);
// });
// console.log(Arr);

// setTimeout(add, 2000);


// console.log(obj);

function getNodes(elements) {
  const Arr = [];
  // console.log(elements.length);
  for (i = 0; i < elements.length; i++) {
    if (elements[i].type == 'node') {
      // console.log(elements[i]);
      const params = {
        nodeID: elements[i].id,
        lat: elements[i].lat,
        lon: elements[i].lon,
      };
      Arr.push(params);
    }
  }
}
//
//

function postMany(Arr) {
  const MongoClient = mongodb.MongoClient;

  const url = 'mongodb://hikar_db:hikar@ds221258.mlab.com:21258/hikar';
  const entries = Arr; // a huge array containing the entry objects

  MongoClient.connect(url, (err, database) => {
    const db = database.db('hikar');
    let collection;
    if (err) {
      throw err;
    }
    collection = db.collection('trailDataTest');
    collection.createIndex({ geometry: '2dsphere' });
    // collection.insertMany(entries);
    if (err) console.log(`error occured: ${err}`);
    else console.log('successfully posted');
  });
}

// postMany(trails);
