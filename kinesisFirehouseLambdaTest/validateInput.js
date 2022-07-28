var Validator = require('jsonschema').Validator;

var v = new Validator();

const validate = (dataToValidata, componentsVaultReportSchema) => {
    try {
        const validationResult = v.validate(dataToValidata, componentsVaultReportSchema);

        const hasErrors = validationResult?.errors?.length > 0;
        const error = validationResult?.errors[0];
    
       return {
            hasErrors,
            error
        };
    } catch(error) {
        return {
            hasErrors: true,
            error
        };
    }
    
}

module.exports = validate;