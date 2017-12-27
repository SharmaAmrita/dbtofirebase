const fs = require('fs');
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const unique = require('array-unique');
const nestedProperty = require("nested-property");
var backup = [];
var lines = fs.readFileSync('swappdb-export.json').toString();
//lines.pop(); // If last element length is lesser than 1, pop from array
var memberIds = [];
var members = {};
var obj = JSON.parse(lines);
var keys = Object.keys(obj);
for (var i = 0; i < keys.length; i++) {
  console.log(keys[i]);
  memberIds[i] = keys[i];
}
var prospectlines = fs.readFileSync('object.json').toString().split('\n');
prospectlines.pop();
prospectlines.forEach(prospectlines => {
  backup.push(JSON.parse(prospectlines));
});
console.log(backup.length);
for(var i = 0; i <keys.length;i++){

members = obj[keys[i]];
members.id = memberIds[i];
for(var j = 0; j < backup.length; j++)
{
   var arr = backup[j].gospellers_email;
   var distinct = unique(arr);
    for(var k = 0; k < distinct.length; k++)
    {
      if(members.email === distinct[k])
      {
        nestedProperty.set(backup[j], "member_id."+members.id, true)
      }
    }
}
}
for(var m = 0; m < backup.length; m++)
{
  backup[m].notes = undefined;
  backup[m].gospellers_email = undefined;
  fs.appendFile("prospects.json", JSON.stringify(backup[m]) + '\n', (err) => {
      if (err) {
          console.error(err);
          return;
      };
      console.log("File has been created");
  });
}
