
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://Mita:mita2017@ds113282.mlab.com:13282/swapp-server-2";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
 console.log(db);
  db.collection('completed_streets').find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
