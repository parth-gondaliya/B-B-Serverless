export const serverInfo = {
  baseUrl: "https://a7072ljrba.execute-api.us-east-1.amazonaws.com/api",
  users: "/users",
  firebaseUrl: "https://us-central1-csci5410-group08.cloudfunctions.net",
  postQuestion: "/postQuestion",
  getAnswer: "/getAnswer",
  verifyCaesarCipher: "/verifyCaesarCipher",
  postFeedback: "/postFeedback",
  getFeedback: "/getAllFeedback",
  getRecommendation: "/tourRecommendationML",
  bookTour: "/tour",
};

export const regEx = {
  lettersOnly: /^[a-zA-Z\s]*$/,
  email:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
};

// Handle input changes
export const simpleChangeHandler = (event) => {
  return event.target.value;
};

// Handle changes and only accept alphabets
export const onlyTextChangeHandler = (event) => {
  return event.target.value.replace(/[^a-z]/gi, "");
};

// Handle changes and only accept integers
export const onlyIntegerChangeHandler = (event) => {
  return event.target.value.replace(/[^0-9]/gi, "");
};

export const generateRandomText = (length) => {
  const possible = "abcdefghijklmnopqrstuvwxyz";
  const randomNumber = Math.floor(Math.random() * possible.length);
  let randomText = "";
  for (let i = 0; i < length; i++) {
    const index = (i + randomNumber) % 26;
    randomText += possible.charAt(index);
  }
  return randomText;
};
