// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-central-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const timestamp = + new Date();
const ttlTime = (timestamp / 1000 + 60 * 60 * 24 * 7).toString(); // 7 days

var params = {
  TableName: 'test-collections',
  Item: {
    "componentId" : {S: "YoutubeVideo_1"},
    "installationTimestamp" : {N: timestamp.toString()},
    "collectionId": {S: "collection_1"},
    "hoursInstalled": {N: "8"},
    "contributorsGithubUserNames": {S: "user1,user2"},
    "jiraProjectId": {S: "LORA1"},
    "installationType": {S: "ReactComponent"},
    "ttl": {N: ttlTime}
  }
};

// Call DynamoDB to add the item to the table
ddb.putItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});