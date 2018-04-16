/* @author: raunakbhojwani
 * April 16, 2018
 * HikAR
 */

export function calcDistance(lat1, lon1, lat2, lon2) {
  const EARTH_RAD = 6371;
  var degreeLat = degreeToRad(lat2 - lat1);  // deg2rad below
  var degreeLon = degreeToRad(lon2 - lon1); 
  
  var a = 
    Math.sin(degreeLat/2) * Math.sin(degreeLat/2) +
    Math.cos(degreeToRad(lat1)) * Math.cos(degreeToRad(lat2)) * 
    Math.sin(degreeLon/2) * Math.sin(degreeLon/2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = EARTH_RAD * c; // Distance in km
  return d;
}

function degreeToRad(degree) {
  return degree * (Math.PI/180)
}