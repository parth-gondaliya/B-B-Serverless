/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const Firestore = require("@google-cloud/firestore");

exports.helloWorld = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
    return;
  }

  // Create a new client
  try {
    const firestore = new Firestore();
    const body = req.body;
    firestore.collection("customerFeedback").doc(body.userId).set({
      userId: body.userId,
      feedback: body.feedback,
    });
    res.status(200).send("Data added");
  } catch (err) {
    console.log("Error=>", err);
    res.status(500).send(err);
  }
};
