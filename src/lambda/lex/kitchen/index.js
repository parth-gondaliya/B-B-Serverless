const aws = require("aws-sdk");
const s3 = new aws.S3({ apiVersion: "2006-03-01" });
var easyinvoice = require("easyinvoice");
var db = new aws.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async (event) => {
  try {
    let body = event;
    console.log("body===>", body);
    const mainCourseItem = body["main"]["quantity"];
    const mainCourse = body["main"]["description"];
    const mainCourePrice = body["main"]["price"];

    const toppingItem = body["side"]["quantity"];
    const topping = body["side"]["description"];
    const toppingPrice = body["side"]["price"];

    const drinksItem = body["drink"]["quantity"];
    const drinks = body["drink"]["description"];
    const drinksPrice = body["drink"]["price"];

    const userName = body["username"];

    const price = {
      english: 10,
      indian: 15,
      Continental: 12,
      tea: 10,
      coffee: 10,
      greentea: 12,
      Veggies: 10,
      eggs: 15,
      Bacon: 12,
    };

    let products = [
      {
        quantity: mainCourseItem,
        description: mainCourse,
        "tax-rate": 6,
        price: mainCourePrice,
      },
      {
        quantity: toppingItem,
        description: topping,
        "tax-rate": 6,
        price: toppingPrice,
      },
      {
        quantity: drinksItem,
        description: drinks,
        "tax-rate": 6,
        price: drinksPrice,
      },
    ];

    const totalItem = mainCourseItem + toppingItem + drinksItem;
    const totalPrice =
      mainCourseItem * mainCourePrice +
      toppingItem * toppingPrice +
      drinksItem * drinksPrice;
    const items = JSON.stringify(products);

    console.log("==>totalItem==>", totalItem);
    console.log("===>totalPrice==>", totalPrice);

    //store in DB
    //get the large value
    const dbCount = await db
      .scan({ Select: "COUNT", TableName: "csci5410orderInvoice" })
      .promise();

    const nextOrderId = dbCount.Count + 1;

    //add data
    db.putItem(
      {
        Item: {
          orderId: { S: nextOrderId + "" },
          TimeStamp: { S: new Date().toDateString() },
          totalPrice: { S: JSON.stringify(totalPrice) },
          totalItem: { S: JSON.stringify(totalItem) },
          items: { S: items },
        },
        TableName: "csci5410orderInvoice",
      },
      function (err, data) {
        if (err) {
          console.log("Error =>", err);
        } else {
          console.log("Success =>", data);
        }
      }
    );

    //invoice store in S3
    var data = {
      images: {
        // The logo on top of your invoice
        logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
        // The invoice background
        background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
      },
      // Your own data
      sender: {
        company: "CSCI5408",
        address: "DALHOUSIE",
        zip: "B3L4P7",
        city: "Halifax",
        country: "Canada",
      },
      // Your recipient
      client: {
        company: userName,
      },
      information: {
        number: nextOrderId,
        // Invoice data
        date: new Date().toISOString().slice(0, 10),
        // Invoice due date
        "due-date": "-",
      },
      // Total values are being calculated automatically
      products,
      // The message you would like to display on the bottom of your invoice
      "bottom-notice": "Kindly pay your invoice within 15 days.",
      // Settings to customize your invoice
      settings: {
        currency: "CAD",
      },
      translate: {},
    };

    const result = await easyinvoice.createInvoice(data);

    const params_new = {
      Bucket: "csci5410invoice",
      Key: nextOrderId + ".pdf",
      Body: Buffer.from(result.pdf, "base64"),
      ContentType: "application/pdf",
    };

    await s3.putObject(params_new).promise();
    return {
      statusCode: 200,
    };
  } catch (e) {
    console.log("Error====>", e.message);
    return {
      statusCode: 500,
    };
  }
};
