const aws = require("aws-sdk");
var db = new aws.DynamoDB({ apiVersion: "2012-08-10" });
const docClient = new aws.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const body = event;
    console.log("body ", body);
    const date = body["date"];
    const type = body["type"];

    console.log("body==>", date, type);

    //get the count of that day for {type} of room available
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

    console.log("dbData===>", dbData);

    const newACRoomCount = type == "AC" ? "9" : "10";
    const newNonACRoomCount = type == "NONAC" ? "9" : "10";

    if (dbData && Object.keys(dbData).length === 0) {
      //no data available
      //add data into as 10 for both rooms
      await db
        .putItem({
          Item: {
            date: {
              S: date + "",
            },
            AC: {
              N: newACRoomCount,
            },
            NONAC: {
              N: newNonACRoomCount,
            },
          },
          TableName: "csci5410booking",
        })
        .promise();

      console.log("data added");
    } else {
      //update the room count

      let acRooms = dbData["Item"]["AC"]["N"];
      let nonAcRooms = dbData["Item"]["NONAC"]["N"];

      if (type == "AC") {
        //AC
        acRooms = Number(acRooms) - 1;
      } else {
        //NONAC
        nonAcRooms = Number(nonAcRooms) - 1;
      }

      console.log("===============>", acRooms, nonAcRooms);

      await db
        .updateItem({
          TableName: "csci5410booking",
          Key: {
            date: {
              S: date + "",
            },
          },
          UpdateExpression: "set AC = :x, NONAC = :y",
          ExpressionAttributeValues: {
            ":x": { N: acRooms + "" },
            ":y": { N: nonAcRooms + "" },
          },
        })
        .promise();

      console.log("data updatedd!!");
    }

    return {
      statusCode: 200,
    };
  } catch (e) {
    console.log("Error====>", e.message);
    return {
      statusCode: 500,
      error: e.message,
    };
  }
};
