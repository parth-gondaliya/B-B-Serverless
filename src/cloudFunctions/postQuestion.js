const Firestore = require('@google-cloud/firestore');

exports.helloWorld = (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

// Create a new client
    try{
    const firestore = new Firestore();
    const body = req.body;
    firestore.collection('questions')
            .doc(body.userId)
            .set({
              answer: body.answer  
            });
  res.status(200).send("Data added");
  } catch(err){
    console.log("Error=>",err);
  res.status(500).send(err);
  }
};