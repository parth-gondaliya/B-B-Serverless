const axios = require("axios");
exports.handler = async (event) => {
  try {
    
    //call an api to pass the event to the academy acc's api
    // let res = await axios.post("https://a7072ljrba.execute-api.us-east-1.amazonaws.com/api/lex", { event: event );
  
    console.log(event);
    var config = {
      method: 'post',
      url: 'https://a7072ljrba.execute-api.us-east-1.amazonaws.com/api/lex',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : {event:event}
    };

    const ans = await axios(config);
    return ans.data; 
   
  } catch (e) {
    // console.log("errrrrr",JSON.parse(e.response["data"]));
    return {
      dialogAction: {   
      type: 'Close',   
      fulfillmentState: "Failed", // (required)   
      message: { // (optional)     
      contentType: "PlainText or SSML",     
      content: "Message to convey to the user"   
      } 
      }}
    }
};

