// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-central-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
  
var params = {
    ExpressionAttributeValues: {
        ':componentId': {S: 'Banner_1'},
    //   ':e' : {N: '09'},
    //   ':topic' : {S: 'PHRASE'}
    },
    //KeyConditionExpression: 'Season = :s and Episode > :e',
    KeyConditionExpression: 'componentId = :componentId',
    //ProjectionExpression: 'installationTimestamp, componentId',
    //FilterExpression: 'contains (Subtitle, :topic)',
    TableName: 'test-collections'
};

ddb.query(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        //console.log("Success", data.Items);
        data.Items.forEach(function(element, index, array) {
            console.log(element)
            //console.log(element.Title.S + " (" + element.Subtitle.S + ")");
        });
    }
});