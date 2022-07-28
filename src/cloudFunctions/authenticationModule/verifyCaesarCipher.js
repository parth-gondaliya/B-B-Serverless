exports.helloWorld = (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');
  
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
      return;
    }
  
    try {
      const body = req.body;
  
      const key = body.key;
      const text = body.text;
      const answer = body.answer;
      
      let result = "";
      for(let i = 0; i < text.length; i++) {
        let ch = text.charCodeAt(i);
        ch += key;
        if(ch > 122) {
          ch -= 26;
        }
        result += String.fromCharCode(ch);
      }
      if (result === answer) {
        res.status(200).send({ isVerified: true });
      } else {
        res.status(200).send({ isVerified: false });
      }
    } catch (err) {
      console.log("Error=>",err);
      res.status(500).send(err);
    }
  };