const { FirehoseClient, PutRecordCommand } = require("@aws-sdk/client-firehose");

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
                const installationId = `${componentId.toString()}-${timestamp.toString()}`;
                
                var writeData = {
                    "installationId": installationId,
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
                    const client = new FirehoseClient({ region: "eu-central-1" });
                    const command = new PutRecordCommand({
                        DeliveryStreamName: "components-vault-data-delivery-stream",
                        Record: {
                            Data: Buffer.from(
                                JSON.stringify(writeData)
                            )
                        }
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