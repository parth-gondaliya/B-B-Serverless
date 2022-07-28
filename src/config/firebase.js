import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0Wdvt5p6W0t4rnBZ3g-QkpplcXXgsx_8",
  authDomain: "csci5410-group08.firebaseapp.com",
  projectId: "csci5410-group08",
  storageBucket: "csci5410-group08.appspot.com",
  messagingSenderId: "968345354155",
  appId: "1:968345354155:web:d98fb2d63042cc65a85cee"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);