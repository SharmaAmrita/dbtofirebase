/**
 * Migrate MongoDB database to Firebase.
 * Syntax: node migrate.js [-c || --collection=]<MongoDB Collection> [ [-h || --host=]<MongoDB URI>]
 * If no args are provided, the MONGODB_URI
 * env variable declared in the .env file
 * will be used instead.
 */

const env = require('dotenv');
const firebase = require('firebase');
const execSync = require('child_process').execSync;
const minimist = require('minimist');
const readline = require('readline');
const fs = require('fs');

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

var command = "mongoexport -h " + mongoData.uri + ":" + mongoData.port +
            " -d " + mongoData.database + " -u " + mongoData.user +
            " -p " + mongoData.password + " -c " + collection;

console.log("=>", command);

// Run mongoexport -h <uri>:<port> -u <username> -p <password> -d <database> -c <collection>
// var child = execSync(command)

var backup = [];

var lines = fs.readFileSync('prospects.json').toString().split('\n');
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
  apiKey: "key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: "url",
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
