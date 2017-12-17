const mongoClient = require('mongodb').MongoClient
  , assert = require('assert');
const execSync = require('child_process').execSync;
const fs = require('fs');
const async = require('async');
var sync = require('synchronize');
const env = require('dotenv');
const firebase = require('firebase');
const readline = require('readline');
const minimist = require('minimist');
var k = 0;
// const sleep = require('sleep');
const args = minimist(process.argv.slice(2));

env.config({ silent: true });

var collection = args.c || args.collection;

// Parse MongoDB URI - if none is provided, get the environment URI instead
var mongoURI = args.h || args.host || process.env.MONGODB_URI;

// Remove mongo protocol from URI
mongoURI = mongoURI.substr(10);

// Separate data from URI - split on "@", "/" (escaped) and ":" (also escaped)
var mongoData = mongoURI.split(/[@\/\:]/);

// Convert mongoData to object/dictionary
var keys = ["user", "password", "uri", "port", "database"];

keys.forEach((keys, i) => {
  mongoData[keys] = mongoData[0];
  mongoData.shift(); // Removing number-indexed values
});

// Connection URL
var url = 'mongodb://xyz';
// To save the list of collection names.
var array = [];
// Connectiong to Db.
mongoClient.connect(url, function(err, db) {
  // Assert if it fails.
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  // To sync the write process of the collection
  async.waterfall([
    function(callback) {
// Return the list of collections in db.
  db.listCollections().toArray(function(err, collInfos) {
// Assign collection name to an array.
for(var i = 0; i<collInfos.length; i++)
    {
 array[i] = collInfos[i].name;
   }
     console.log(array);
     // Callback function to read from the given collection
     callback(null,array)
  });
},
 function(arg1, callback){
    sync.fiber(function(){
      while(k < arg1.length)
      {
   sync.await(db.collection(arg1[k]).find({}).forEach( function (x) {
    console.log("dbcollections" +k);

     fs.appendFileSync("object.json", JSON.stringify(x) + '\n');
     console.log("file is written" +k);
           if(k == 0)
           {
             var backup = [];

             var lines = fs.readFileSync('object.json').toString().split('\n');
             lines.pop(); // If last element length is lesser than 1, pop from array

             // Assign parsed JSON to backup var
             lines.forEach(line => {
               backup.push(JSON.parse(line));
             });

             // Remove _id field, convert data objects to string if they are objects
             backup = backup.map(item => {
               delete item._id;

               if (typeof item.endDateTime === "object") {
                 item.endDateTime = item.endDateTime["$date"];
               }

               if (typeof item.createDate === "object") {
                 item.createDate = item.createDate["$date"];
               }

               if (typeof item.updateDate === "object") {
                 item.updateDate = item.updateDate["$date"];
               }

               return item;
             });

             // Initialize Firebase
             var config = {
               apiKey: "AIzaSyDaxGSqtW_vaRypclIKH9zpYWEEI0qBBG0",
               authDomain: process.env.FIREBASE_AUTH_DOMAIN,
               databaseURL: "https://demodocument-8005d.firebaseio.com",
               storageBucket: "gs://demodocument-8005d.appspot.com"
             };

             const firebaseApp = firebase.initializeApp(config);

             // Initialize database
             const database = firebaseApp.database().ref().child(collection);

             var promises = [];
             // Insert backup data
             backup.forEach(row => {
               promises.push(database.push(row));
             });

             Promise.all(promises).then(() => {
               process.exit(1);
             });

            fs.unlinkSync("object.json");
         }
      },sync.defers()))
      k++;
}
})
}
], function (err, result){
  console.log(err)
    // db.close();
})
});
