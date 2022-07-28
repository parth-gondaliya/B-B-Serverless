console.log("Loading function");
const aws = require("aws-sdk");
var dynamoDBClient = new aws.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async (event, context) => {
  console.log(event);
  var data = JSON.parse(event.body);
  console.log("data---" + data);

  var BookingIdVar = Date.now();
  let putRequest = {
    TableName: "CSCI5410_Tour_Booking",
    Item: {
      BookingId: { S: BookingIdVar.toString() },
      UserId: { S: data.userId },
      Name: { S: data.tour_name },
      Location: { S: data.tour_location },
      Price: { S: data.tour_price },
    },
  };

  let putRequest2 = {
    TableName: "CSCI5410_Tour_Invoice",
    Item: {
      BookingId: { S: BookingIdVar.toString() },
      UserId: { S: data.userId },
      Name: { S: data.tour_name },
      Location: { S: data.tour_location },
      Price: { S: data.tour_price },
      Date: { S: new Date().toString() },
    },
  };

  //https://technoapple.com/blog/post/Use-Lambda-with-Node.js-to-Insert-Data-Into-DynamoDB
  console.log("putRequest---" + JSON.stringify(putRequest));

  await dynamoDBClient.putItem(putRequest).promise();
  await dynamoDBClient.putItem(putRequest2).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Successful" }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  };
};
