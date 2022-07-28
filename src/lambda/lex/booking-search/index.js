const aws = require("aws-sdk");
var db = new aws.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async (event) => {
const headers= {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json"
};
  try {
    let body = event;
    const date = body["date"];

    //get the large value
    const dbData = await db
      .getItem({
        Key: {
          date: {
            S: date + "",
          },
        },
        TableName: "csci5410booking",
      })
      .promise();
      
     
    const bodyData =  dbData && Object.keys(dbData).length === 0
          ? {
              AC: 10,
              "NONAC": 10,
            }
          : {
              AC: dbData["Item"]["AC"]["N"],
              "NONAC": dbData["Item"]["NONAC"]["N"],
            };
     
    const response = {
        statusCode: 200,
        body: bodyData
    };
    
    return response;
    
  } catch (e) {
    console.log("Error====>", e.message);
     const response = {
        statusCode: 500,
        body: e.message
    };
    
    return response;

  }
};
