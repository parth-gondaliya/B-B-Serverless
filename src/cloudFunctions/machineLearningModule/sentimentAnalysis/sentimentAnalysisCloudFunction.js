exports.helloFirestore = (event, context) => {
  // For Natural Language Processign
  const language = require("@google-cloud/language");
  const client = new language.LanguageServiceClient();

  // For Firestore
  const Firestore = require("@google-cloud/firestore");
  const firestore = new Firestore();

  //https://cloud.google.com/functions/docs/calling/cloud-firestore
  //Referred above document for accessign firestore inside cloud function
  if (event.value && Object.keys(event.value).length) {
    if (event.value.fields.feedback.stringValue !== "") {
      const textToAnalyze = event.value.fields.feedback.stringValue;
      //console.log("ISDEEEEE--EVENTTT" + JSON.stringify(event));

      var documentPathArray = event.value.name.split("/");
      var documentId = documentPathArray[documentPathArray.length - 1];

      sentimentAnalysis(textToAnalyze);

      async function sentimentAnalysis(textToAnalyze) {
        // Prepares a document, representing the provided text
        const document = {
          content: textToAnalyze,
          type: "PLAIN_TEXT",
        };

        //https://cloud.google.com/natural-language/docs/analyzing-sentiment
        // referred above document to detect the sentiment of the document
        const [result] = await client.analyzeSentiment({ document });
        var polarity = "";

        if (result.documentSentiment.score > 0) {
          polarity = "Positive";
        } else if (result.documentSentiment.score < 0) {
          polarity = "Negative";
        } else {
          polarity = "Neutral";
        }

        console.log(
          `Sentiment Score: ${result.documentSentiment.score}` +
            ` && Polarity: ${polarity}`
        );

        firestore.collection("customerFeedback").doc(documentId).set(
          {
            SentimentScore: result.documentSentiment.score,
            Polarity: polarity,
          },
          { merge: true }
        );

        console.log("Docuemnt Update Successful");
      }
    } else {
      console.log("No feedback found");
    }
  }
  console.log("Processing queued");
};
