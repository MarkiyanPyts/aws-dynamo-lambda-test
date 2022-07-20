const { KinesisClient, PutRecordCommand } = require("@aws-sdk/client-kinesis");

// a client can be shared by different commands.
const client = new KinesisClient({ region: "eu-central-1" });

const sendData = async () => {
    const command = new PutRecordCommand({
        StreamName: "components-vault-stream",
        PartitionKey: "test",
        Data: Buffer.from(
            JSON.stringify({
                test: "news",
                date: new Date().toISOString(),
            })
        )
    });
    const response = await client.send(command);
    console.log("resp", response)
};

sendData();