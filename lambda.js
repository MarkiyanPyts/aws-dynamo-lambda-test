const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB({apiVersion: '2012-08-10'});

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = async (event, context) => {
    let body;
    const parsedBody = JSON.parse(event?.body)
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        switch (event.httpMethod) {
            case 'POST':
                const collectionId = parsedBody?.collectionId;
                const componentId = parsedBody?.componentId;
                const hoursInstalled = parsedBody?.hoursInstalled;
                const contributorsGithubUserNames = parsedBody?.contributorsGithubUserNames;
                const jiraProjectId = parsedBody?.jiraProjectId;
                const installationType = parsedBody?.installationType;
                
                const timestamp = + new Date();
                const ttlTime = (timestamp / 1000 + 60 * 60 * 24 * 7).toString(); // 7 days
                
                var params = {
                  TableName: 'test-collections',
                  Item: {
                    "componentId" : {S: componentId.toString()},
                    "installationTimestamp" : {N: timestamp.toString()},
                    "collectionId": {S: collectionId.toString()},
                    "hoursInstalled": {N: hoursInstalled.toString()},
                    "contributorsGithubUserNames": {S: contributorsGithubUserNames.toString()},
                    "jiraProjectId": {S: jiraProjectId.toString()},
                    "installationType": {S: installationType.toString()},
                    "ttl": {N: ttlTime.toString()}
                  }
                };
                
                try {
                    await dynamo.putItem(params).promise();
                    body = JSON.stringify({
                        componentId: componentId,
                        installationTimestamp: timestamp,
                        collectionId: collectionId,
                        hoursInstalled: hoursInstalled,
                        contributorsGithubUserNames: contributorsGithubUserNames,
                        jiraProjectId: jiraProjectId,
                        installationType: installationType,
                        ttl: ttlTime
                    })
                } catch (err) {
                    body = JSON.stringify({error: err});
                }
                
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    }

    return {
        statusCode,
        body,
        headers,
    };
};
