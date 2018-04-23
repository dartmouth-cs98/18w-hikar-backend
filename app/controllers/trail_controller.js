import Trails from '../models/trail_model';
import { calcDistance } from '../distance.js';


export const getTrails = (req, res, next) => {
  Trails.find((err, result) => {
    res.send(result);
  });
};

export const getTrailbyName = (req, res, next) => {
  const id = req.params.name;
  Trails.findOne({ name: id.replace(/\-/g, ' ') }, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
};

export const queryTrails = (req, res, next) => {
  const lat = parseFloat(req.params.lat, 10);
  const lon = parseFloat(req.params.lon, 10);
  const rad = parseInt(req.params.radius, 10);
  const milesInKM = 0.62137119;
  console.log(lat, lon, rad);
  const METERS_PER_MILE = 1609.34;
  Trails.find({
    geometry: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lat, lon],
        },
        $maxDistance: rad * METERS_PER_MILE,
      },
    },
  }, (err, result) => {
    if (err) throw err;
    // console.log(result);
    const names = [];
    let i;
    for (i in result) {
      if (result[i].name) {
        // console.log(result[i].geometry.coordinates[0][0]);
        let distanceKM = 0;
        if (result[i].geometry.coordinates[0][0].length > 1) {
          console.log(result[i].geometry.coordinates[0][0][0], result[i].geometry.coordinates[0][0][1]);
          distanceKM = calcDistance(result[i].geometry.coordinates[0][0][0], result[i].geometry.coordinates[0][0][1], lat, lon);
        } else {
          console.log(result[i].geometry.coordinates[0][0], result[i].geometry.coordinates[0][1]);

          distanceKM = calcDistance(result[i].geometry.coordinates[0][0], result[i].geometry.coordinates[0][1], lat, lon);
        }
        // var distanceKM = calcDistance(result[i].geometry.coordinates[0][0], result[i].geometry.coordinates[0][1], lat, lon);
        console.log(distanceKM);
        const distanceMiles = milesInKM * distanceKM;
        names.push([result[i].name, distanceMiles]);
        // names.push(result[i].name);
      }
    }
    res.send(names);
  });
};
