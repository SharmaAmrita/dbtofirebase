
const mongoClient = require('mongodb').MongoClient
  , assert = require('assert');
//const NumberInt = require('mongoose-int32');
const execSync = require('child_process').execSync;
const fs = require('fs');



// Connection URL
var url = 'mongodb://Amrita:ja.amrita@ds113282.mlab.com:13282/swapp-server-2';
mongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
var fields = {
  "first_name": true,
  "last_name": true,
  "email": true,
  "mobile": true,
  "home_tele": true,
  "point_of_contact": true,
  "church_id": true,
  "gender": true,
  "age":true,
  "language": true,
  "marital_status": true,
  "spiritual_status": true,
  "prospect_status": true,
  "visit_status": true,
  "country_code": true,
  "prospect_id": true,
  "house_no": true,
  "house_name": true,
  "latitude": true,
  "longitude": true,
  "date_of_contact": true,
  "notes": true,
  "gospellers_email": true
}
  db.collection('random_prospect').find({}, fields).forEach( function (x) {
    // x.doors = new String(x.doors); // convert field to string
    // db.collection("completed_streets").save(x);
    x.street_id = "";
    fs.appendFile("object.json", JSON.stringify(x) + '\n', (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
    });
  });

  db.close();
});
