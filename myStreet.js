const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const request = require('sync-request');
// const https = require('https');
// const execSync = require('child_process').execSync;
// const fs = require('fs');
// const sync = require('synchronize');
// const async = require('async');
// const request = require('request');
// const NumberInt = require('mongoose-int32');

//connecting to mongodb
var url = 'mongodb://Amrita:ja.amrita@ds113282.mlab.com:13282/swapp-server-2';
mongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  //connec to mongodb instance running swapp-server2
  //get the desired collection here
  db.collection('address').distinct('street', function(err, streets) {
    streets.forEach(function(street) {
      var response = request('GET', "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+street+"&key=AIzaSyD3OCzqR3ARiglIlw4-40ZhnnD8S-uHXa8");
      var data = JSON.parse(response.getBody('utf8'));
      console.log(data['predictions'][0]['place_id']);
    });
  });
});
