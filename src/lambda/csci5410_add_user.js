const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let header= {
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        };
        
    try {
    console.log("=====>",JSON.parse(event.body));    
     await dynamo.put({
            TableName: "CSCI_5410_USERS",
            Item: {...JSON.parse(event.body)}
        }).promise();
        
      
    return {
        statusCode:200,
        body: JSON.stringify("User has been added"),
        headers :header
    }
    
    } catch (err) {
        console.log("Error in add user of function CSCI_5410_USERS");
        return {
            statusCode:400,
            body: JSON.stringify(err.message),
            headers :header
        }
    }
};