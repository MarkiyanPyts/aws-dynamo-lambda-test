exports.handler = async (event) => {
    const secretToken = "componentsVaultSecret";
    let Effect = "Deny"
    
    if (secretToken == event?.authorizationToken) {
        Effect = "Allow"
    }
    
    return {
      "principalId": "user",
      "policyDocument": {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": "execute-api:Invoke",
            "Effect": Effect,
            "Resource": "arn:aws:execute-api:eu-central-1:501486418455:g3frgqmit8/*/*/test-components-vault-install"
          }
        ]
      }
    };
};
