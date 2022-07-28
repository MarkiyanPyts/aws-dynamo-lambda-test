var Validator = require('jsonschema').Validator;
const componentsVaultReportSchema = require("./validatorSchemas/componentsVault")
var v = new Validator();
var installationReport = {
    componentId : "banner_1",
    collectionId: "collection_1",
    hoursInstalled: 5,
    contributors: [
        {
            "email": "john.doe@osf.digital",
            "githubUserName": "MarkiyanPyts"
        },
        {
            "email": "john.doe@osf.digital",
            "githubUserName": "MarkiyanPyts"
        }
    ],
    jiraProjectId: "LATAM",
    installationType: "ReactComponent",
    installerEmail: "john.doe@osf.digital"
};



const validate = (dataToValidate) => {
    const validationResult = v.validate(installationReport, componentsVaultReportSchema);
    const hasErrors = validationResult?.errors?.length > 0;
    const error = validationResult?.errors[0];

   return {
        hasErrors,
        error
    };
}

module.exports.validate = validate;