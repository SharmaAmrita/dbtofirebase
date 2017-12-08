const mongoClient = require('mongodb').MongoClient
  , assert = require('assert');
const execSync = require('child_process').execSync;
const fs = require('fs');
const async = require('async');


// Connection URL
var url = 'mongodb://Mita:mita2017@ds113282.mlab.com:13282/swapp-server-2';
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
 function(arg1,arg2, callback){
   console.log("hello")
   for(var i = 0; i< arg1.length; i++)
   {
     console.log("print"+i);
     async.waterfall([
       function(callbacks){
   db.collection(arg1[i]).find({}).forEach( function (x) {
    console.log("dbcollections");

     fs.appendFileSync("object.json", JSON.stringify(x) + '\n');
   })
      console.log("file is written")
      callbacks(null,i,arg1[i]); },
      function(arg1,arg2,callbacks){
        console.log(arg1,arg2);
          if(arg1 == 0)
          {
            console.log("deleted file")
          fs.unlinkSync("object.json");
          }
      }],function (err, result){
        console.log(err)
      });
 }
 }
], function (err, result){
  console.log(err)
    // db.close();
})
});
