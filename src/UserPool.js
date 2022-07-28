import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_5qHy65lay",
  ClientId: "1ob5ts6lr81gq7u7hh64r9k2rk",
};

export default new CognitoUserPool(poolData);