/* @author: raunakbhojwani
 * April 16, 2018
 * HikAR
 */

export function calcDistance(lat1, lon1, lat2, lon2) {
  const EARTH_RAD = 6371;
  const degreeLat = degreeToRad(lat2 - lat1);  // deg2rad below
  const degreeLon = degreeToRad(lon2 - lon1);

  const a =
    Math.sin(degreeLat / 2) * Math.sin(degreeLat / 2) +
    Math.cos(degreeToRad(lat1)) * Math.cos(degreeToRad(lat2)) *
    Math.sin(degreeLon / 2) * Math.sin(degreeLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = EARTH_RAD * c; // Distance in km
  return d;
}

function degreeToRad(degree) {
  return degree * (Math.PI / 180);
}


export function sortArray(Arr) {
  return Arr.sort(compareNums).reverse();
}

function compareNums(a, b) {
  return a[1] - b[1];
}
