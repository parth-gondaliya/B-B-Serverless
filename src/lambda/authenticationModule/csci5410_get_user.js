const AWS = require('aws-sdk') 

const dynamo = new AWS.DynamoDB.DocumentClient() 

exports.handler = async (event, context) => {
    let body 
    let statusCode = '200' 
    const headers= {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Content-Type": "application/json"
        };
        

    try {
        const userId = event.pathParameters.id;
        console.log(event);
        const params = {
            TableName: 'CSCI_5410_USERS',
            Key: {
                userId
            }
        }
        const user = await dynamo.get(params).promise() 
        body = {
            success: true,
            data: user
        }
    } catch (err) {
        console.log(err)
        statusCode = '400' 
        body = err.message 
    } finally {
        body = JSON.stringify(body) 
    }

    return {
        statusCode: statusCode,
        body: body,
        headers: headers
    }; 
} 
