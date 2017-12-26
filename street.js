const mongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  const https = require('https');
// const NumberInt = require('mongoose-int32');
const execSync = require('child_process').execSync;
const fs = require('fs');
const sync = require('synchronize');
const async = require('async');

var placesId = [];
var m = [];
var lat = [];
var lng = [];
var street = [];
var i = 0 ;
// Connection URL
var url = 'mongodb://Amrita:ja.amrita@ds113282.mlab.com:13282/swapp-server-2';
mongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
var fields = {
  "street_id": true,
  "latitude": true,
  "longitude": true,
  "doors": true,
  "state": true,
  "city": true,
  "country": true,
  "street": true,
  "locality": true
}
db.collection('address').distinct(("street"), function(err,dat){
  async.waterfall([
    function(callback) {
   while(i < dat.length){
    sync.fiber(function(){db.collection('address').findOne({"street":dat[i]}, fields, function(err, doc){
   lat.push(doc.latitude);
   lng.push(doc.longitude);
   street.push(doc.street);
   if(lat.length == i)
   {
      callback(null,lat,lng,street)
   }
})
});
  i++;
   }
 },function(lat,lng,street,callback){
    var i = 0;
    while(i < 3)
    {
var url ="https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+street[i]+"&types=address&location="+lat[i]+","+lng[i]+"&key=AIzaSyD3OCzqR3ARiglIlw4-40ZhnnD8S-uHXa8";

    postRequest(url,i,m);
    i++;
    }
function postRequest(url,i,m){
  console.log("I came here I guess", url, i);
    https.get(url, (res) => {
      console.log(url);

      res.on('data', (d) => {

        m.push(d);
      }).on('end', function() {
  let data   = Buffer.concat(m);
 let schema = JSON.parse(data);
console.log(schema);
  // var buf = data.slice(17,data.length-14);
  // console.log(JSON.parse(buf.toString()));
  console.log(schema.results);
  for(var j = 0; j<schema.results.length; j++  )
  {
    console.log(schema.results[j].place_id);
  }
});

}).on('error', (e) => {
      console.error(e);
    });

        // for(var j = 0; j <= i; j++)
        // {
        //   placesId.push(street(i))
        // }

}
}
],function (err, result){
  console.log(err)

})


    });
});
