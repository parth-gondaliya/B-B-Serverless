/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 const Firestore = require('@google-cloud/firestore');

 exports.helloWorld = async (req, res) => {
 
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
     const snapshot = await firestore.collection('questions')
             .doc(body.userId)
             .get();
   res.status(200).send(snapshot.data());
   } catch(err){
     console.log('Error=>',err);
     res.status(500).send(err);
   }
 };
 