const { FirehoseClient, PutRecordCommand } = require("@aws-sdk/client-firehose");
const validateInput = require("./validateInput")
const componentsVaultValidatorSchema = require("./validatorSchemas/componentsVault")

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
                const rawData = {
                    collectionId: parsedBody?.collectionId,
                    componentId: parsedBody?.componentId,
                    hoursInstalled: parsedBody?.hoursInstalled,
                    contributors: parsedBody?.contributors,
                    jiraProjectId: parsedBody?.jiraProjectId,
                    installationType: parsedBody?.installationType,
                    installerEmail: parsedBody?.installerEmail
                };

                const validationResult = validateInput(rawData, componentsVaultValidatorSchema)

                if (validationResult.hasErrors) {
                    headers['X-Error-Message'] = validationResult.error.details[0].message;
                    body = {
                        error: validationResult.error
                    };
                    break;
                }
                
                const timestamp = + new Date();
                const installationId = `${rawData?.componentId.toString()}-${timestamp.toString()}`;

                const writeData = {
                    "installationId": installationId,
                    "componentId" : rawData?.componentId.toString(),
                    "installationTimestamp" : timestamp,
                    "collectionId": rawData?.collectionId.toString(),
                    "hoursInstalled": rawData?.hoursInstalled,
                    "contributors": rawData?.contributors.toString(),
                    "jiraProjectId": rawData?.jiraProjectId.toString(),
                    "installationType": rawData?.installationType.toString(),
                    "installerEmail": rawData?.installerEmail.toString(),
                };
                
                try {
                    const client = new FirehoseClient({ region: "eu-central-1" });
                    const command = new PutRecordCommand({
                        DeliveryStreamName: "components-vault-data-lake-delivery-stream",
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
                        contributors: contributors,
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