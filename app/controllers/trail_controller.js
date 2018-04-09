// import axios from 'axios';
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const DOMParser = require('xmldom').DOMParser;

const doc = new DOMParser();

const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    myFunction(this);
  }
};
xhr.open('GET', 'https://api.openstreetmap.org//api/0.6/map?bbox=-72.27281,43.70611,-72.24857,43.73093', true);
xhr.send();

function myFunction(xml) {
  let x,
    i,
    xmlDoc,
    txt;
  const dom = doc.parseFromString(xml);
  txt = '';
  // console.log(xmlDoc);
  x = dom.getElementsByTagName('node');
  console.log(x[0]);
  // for (i = 0; i < x.length; i++) {
  //   txt += `${x[i].getAttribute('user')}<br>`;
  // }
}
