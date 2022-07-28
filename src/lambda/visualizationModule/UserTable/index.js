const aws = require("aws-sdk");
const axios = require("axios");

exports.handler = async (event) => {
  // TODO implement

  console.log(event);

  console.log(JSON.stringify(event.Records[0].dynamodb.NewImage));

  var data = event.Records[0].dynamodb.NewImage;

  var filtered_data = aws.DynamoDB.Converter.unmarshall(data);

  console.log(filtered_data);

  try {
    const response = await axios.post(
      "https://us-central1-csci5410-group08.cloudfunctions.net/userTableVisualization",
      filtered_data
    );
    console.log(response);
  } catch (error) {
    console.log(`Error: ${error}`);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
