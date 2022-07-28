console.log("Loading function");
const aws = require("aws-sdk");
var dynamoDBClient = new aws.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async (event, context) => {
  try {
    let getRequest = {
      TableName: "CSCI5410_Tour_Booking",
    };

    var items;
    const scanResults = [];

    do {
      items = await dynamoDBClient.scan(getRequest).promise();
      console.log(items);
      items.Items.forEach((item) =>
        scanResults.push(aws.DynamoDB.Converter.unmarshall(item))
      );
      getRequest.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    console.log("scanResults" + JSON.stringify(scanResults));

    return {
      statusCode: 200,
      body: JSON.stringify({ allToursData: scanResults }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.log("Error" + error);
  }
};
