var Validator = require('jsonschema').Validator;

var v = new Validator();

const validate = (dataToValidate, componentsVaultReportSchema) => {
    const validationResult = v.validate(dataToValidate, componentsVaultReportSchema);
    const hasErrors = validationResult?.errors?.length > 0;
    const error = validationResult?.errors[0];

   return {
        hasErrors,
        error
    };
}

module.exports.validate = validate;