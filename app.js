/*
 * Copyright 2017 Google Inc. All rights reserved.
 *
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

// Style credit: https://snazzymaps.com/style/1/pale-dawn
const mapStyle = [{
  'featureType': 'administrative',
  'elementType': 'all',
  'stylers': [{
    'visibility': 'on',
  },
  {
    'lightness': 33,
  },
  ],
},
{
  'featureType': 'landscape',
  'elementType': 'all',
  'stylers': [{
    'color': '#f2e5d4',
  }],
},
{
  'featureType': 'poi.park',
  'elementType': 'geometry',
  'stylers': [{
    'color': '#c5dac6',
  }],
},
{
  'featureType': 'poi.park',
  'elementType': 'labels',
  'stylers': [{
    'visibility': 'on',
  },
  {
    'lightness': 20,
  },
  ],
},
{
  'featureType': 'road',
  'elementType': 'all',
  'stylers': [{
    'lightness': 20,
  }],
},
{
  'featureType': 'road.highway',
  'elementType': 'geometry',
  'stylers': [{
    'color': '#c5c6c6',
  }],
},
{
  'featureType': 'road.arterial',
  'elementType': 'geometry',
  'stylers': [{
    'color': '#e4d7c6',
  }],
},
{
  'featureType': 'road.local',
  'elementType': 'geometry',
  'stylers': [{
    'color': '#fbfaf7',
  }],
},
{
  'featureType': 'water',
  'elementType': 'all',
  'stylers': [{
    'visibility': 'on',
  },
  {
    'color': '#acbcc9',
  },
  ],
},
];

// Escapes HTML characters in a template literal string, to prevent XSS.
// See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
function sanitizeHTML(strings) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' };
  let result = strings[0];
  for (let i = 1; i < arguments.length; i++) {
    result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
      return entities[char];
    });
    result += strings[i];
  }
  return result;
}

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBkYlruEanq2C3DmywfA4-mEE7JpO276ZE",
  authDomain: "ny-sub-sta.firebaseapp.com",
  databaseURL: "https://ny-sub-sta.firebaseio.com",
  projectId: "ny-sub-sta",
  storageBucket: "ny-sub-sta.appspot.com",
  messagingSenderId: "602490105733",
  appId: "1:602490105733:web:be91c1cc1daa0b03d1deec"
};
// Initialize Firebase
// Create the map.
let initMap = async () => { 
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: { lat: 53.349816, lng: -6.260257 },
    styles: mapStyle,
  });
 //datastore used for test
  //const DATA = 'https://api.jsonbin.io/b/5e4ef807d3c2f35597f4c1f8';

  var DATA = 'https://ny-sub-sta.firebaseio.com/data.json';

  
  // Load the places GeoJSON onto the map.
  map.data.loadGeoJson(DATA, { idPropertyName: 'placeid' });

  // Define the custom marker icons, using the place's "category".
  map.data.setStyle((feature) => {
    return {
      icon: {
        url: `img/icon_${feature.getProperty('category')}.png`,
        scaledSize: new google.maps.Size(32, 32),
      },
    };
  });

  const apiKey2 = 'AIzaSyBxT9pyvtTWkBOWHfzjynZrheCuhJ13Au4';
  const infoWindow = new google.maps.InfoWindow();

  // Show the information for a place when its marker is clicked.
  map.data.addListener('click', (event) => {

    const name = event.feature.getProperty('name');
    const description = event.feature.getProperty('description');
    const date = event.feature.getProperty('date');
    const url = event.feature.getProperty('url');
    const position = event.feature.getGeometry().get();
    const content = sanitizeHTML`
      <div style="margin-left:20px; margin-bottom:20px;">
        <h2>${name}</h2><p>${description}</p>
        <p><b>Incident date:</b> ${date}<br/><b>URL:</b> ${url}<br/><b>Lat.:</b> ${position.lat()}<br/><b>Long.:</b> ${position.lng()}</p>
        <p><img src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${position.lat()},${position.lng()}&key=${apiKey2}"></p>
      </div>
      `;

    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
    infoWindow.open(map);
  });

  // Build and add the search bar
  const card = document.createElement('div');
  const titleBar = document.createElement('div');
  const title = document.createElement('div');
  const container = document.createElement('div');
  const input = document.createElement('input');
  const options = {
    types: ['address'],
    componentRestrictions: { country: 'irl' },
  };

  card.setAttribute('id', 'pac-card');
  title.setAttribute('id', 'title');
  title.textContent = 'Detect crime places near your position';
  titleBar.appendChild(title);
  container.setAttribute('id', 'pac-container');
  input.setAttribute('id', 'pac-input');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'Enter your position');
  container.appendChild(input);
  card.appendChild(titleBar);
  card.appendChild(container);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  // Make the search bar into a Places Autocomplete search bar and select
  // which detail fields should be returned about the place that
  // the user selects from the suggestions.
  const autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.setFields(
    ['address_components', 'geometry', 'name']);

  // Set the origin point when the user selects an address
  const originMarker = new google.maps.Marker({ map: map });
  originMarker.setVisible(false);
  let originLocation = map.getCenter();

  autocomplete.addListener('place_changed', async () => {
    originMarker.setVisible(false);
    originLocation = map.getCenter();
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert('No address available for input: \'' + place.name + '\'');
      return;
    }

    // Recenter the map to the selected address
    originLocation = place.geometry.location;
    map.setCenter(originLocation);
    map.setZoom(15);
    console.log(place);

    originMarker.setPosition(originLocation);
    originMarker.setVisible(true);

    // Use the selected address as the origin to calculate distances
    // to each of the place locations
    const rankedPlaces = await calculateDistances(map.data, originLocation);
    showPlacesList(map.data, rankedPlaces);

    return;
  });
}

/**
 * Use Distance Matrix API to calculate distance from origin to each place.
 * @param {google.maps.Data} data The geospatial data object layer for the map
 * @param {google.maps.LatLng} origin Geographical coordinates in latitude
 * and longitude
 * @return {Promise<object[]>} n Promise fulfilled by an array of objects with
 * a distanceText, distanceVal, and placeid property, sorted ascending
 * by distanceVal.
 */
async function calculateDistances(data, origin) {
  const places = [];
  const destinations = [];

  // Build parallel arrays for the place IDs and destinations
  data.forEach((place) => {
    const placeNum = place.getProperty('placeid');
    const placeLoc = place.getGeometry().get();

    places.push(placeNum);
    destinations.push(placeLoc);
  });

  // Retrieve the distances of each place from the origin
  // The returned list will be in the same order as the destinations list
  const service = new google.maps.DistanceMatrixService();
  const getDistanceMatrix =
    (service, parameters) => new Promise((resolve, reject) => {
      service.getDistanceMatrix(parameters, (response, status) => {
        if (status != google.maps.DistanceMatrixStatus.OK) {
          reject(response);
        } else {
          const distances = [];
          const results = response.rows[0].elements;
          for (let j = 0; j < results.length; j++) {
            const element = results[j];
            const distanceText = element.distance.text;
            const distanceVal = element.distance.value;
            const distanceObject = {
              placeid: places[j],
              distanceText: distanceText,
              distanceVal: distanceVal,
            };
            distances.push(distanceObject);
          }

          resolve(distances);
        }
      });
    });
  //DRIVING / TRANSIT / BICYCLING /WALKING
  const distancesList = await getDistanceMatrix(service, {
    origins: [origin],
    destinations: destinations,
    travelMode: 'WALKING',
    unitSystem: google.maps.UnitSystem.METRIC,
  });

  distancesList.sort((first, second) => {
    return first.distanceVal - second.distanceVal;
  });

  return distancesList;
}

/**
 * Build the content of the side panel from the sorted list of places
 * and display it.
 * @param {google.maps.Data} data The geospatial data object layer for the map
 * @param {object[]} places An array of objects with a distanceText,
 * distanceVal, and placeid property.
 */
function showPlacesList(data, places) {
  if (places.length == 0) {
    console.log('empty places');
    return;
  }

  let panel = document.createElement('div');
  // If the panel already exists, use it. Else, create it and add to the page.
  if (document.getElementById('panel')) {
    panel = document.getElementById('panel');
    // If panel is already open, close it
    if (panel.classList.contains('open')) {
      panel.classList.remove('open');
    }
  } else {
    panel.setAttribute('id', 'panel');
    const body = document.body;
    body.insertBefore(panel, body.childNodes[0]);
  }


  // Clear the previous details
  while (panel.lastChild) {
    panel.removeChild(panel.lastChild);
  }

  places.forEach((place) => {
    // Add place details with text formatting
    const name = document.createElement('p');
    name.classList.add('place');
    const currentPlace = data.getFeatureById(place.placeid);
    name.textContent = currentPlace.getProperty('name');
    panel.appendChild(name);
    const distanceText = document.createElement('p');
    distanceText.classList.add('distanceText');
    distanceText.textContent = place.distanceText;
    panel.appendChild(distanceText);
  });

  // Open the panel xx
  panel.classList.add('open');

  return;
}
