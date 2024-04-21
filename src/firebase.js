import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_4N76AxcqjzNe2jdNkoSqD2vkoe4fw4U",
  authDomain: "moviematch-edf8d.firebaseapp.com",
  projectId: "moviematch-edf8d",
  storageBucket: "moviematch-edf8d.appspot.com",
  messagingSenderId: "1092747225321",
  appId: "1:1092747225321:web:eb942a9b97542dad2f6878",
  measurementId: "G-RJGKG92KR6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { auth, firestore };