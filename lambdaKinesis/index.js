const { KinesisClient, PutRecordCommand } = require("@aws-sdk/client-kinesis");

// a client can be shared by different commands.
const client = new KinesisClient({ region: "eu-central-1" });

exports.handler = async (event, context) => {
    let body;
    const parsedBody = JSON.parse(event?.body)
    let statusCode = '500';
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
                const installerEmail = parsedBody?.installerEmail;
                
                const timestamp = + new Date();
                
                var writeData = {
                    "installationId": `${componentId.toString()}-${timestamp.toString()}`,
                    "componentId" : componentId.toString(),
                    "installationTimestamp" : timestamp,
                    "collectionId": collectionId.toString(),
                    "hoursInstalled": hoursInstalled,
                    "contributorsGithubUserNames": contributorsGithubUserNames.toString(),
                    "jiraProjectId": jiraProjectId.toString(),
                    "installationType": installationType.toString(),
                    "installerEmail": installerEmail.toString(),
                };
                
                try {
                    const command = new PutRecordCommand({
                        StreamName: "components-vault-stream",
                        PartitionKey: `${componentId}-${timestamp}`,
                        Data: Buffer.from(
                            JSON.stringify(writeData)
                        )
                    });
                    const response = await client.send(command);
                    
                    statusCode = '200';
                    
                    body = JSON.stringify({
                        res: response,
                        installationId: `${componentId}-${timestamp}`,
                        componentId: componentId,
                        installationTimestamp: timestamp,
                        collectionId: collectionId,
                        hoursInstalled: hoursInstalled,
                        contributorsGithubUserNames: contributorsGithubUserNames,
                        jiraProjectId: jiraProjectId,
                        installerEmail: installerEmail,
                        installationType: installationType
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