const schema = {
    type: "object",
    properties: {
        componentId : {
            type: "string",
            minLength: 1,
            maxLength: 50
        },
        collectionId: {
            type: "string",
            minLength: 1,
            maxLength: 50
        },
        hoursInstalled: {
            type: "number",
            maximum: 1000,
            minimum: 0
        },
        contributors: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    email: {
                        type: "string",
                        format: "email",
                        minLength: 1,
                        maxLength: 50
                    },
                    githubUserName: {
                        type: "string",
                        minLength: 1,
                        maxLength: 50
                    }
                },
                required: [
                    "email",
                    "githubUserName"
                ]
            }
        },
        jiraProjectId: {
            type: "string",
            minLength: 1,
            maxLength: 50
        },
        installationType: {
            type: "string",
            minLength: 1,
            maxLength: 50
        },
        installerEmail: {
            type: "string",
            format: "email",
        },
    },
    required: ["componentId", "collectionId", "hoursInstalled", "contributors", "installationType"]
};

module.exports = schema;