import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCm4MS3c1FoGAVHop6T4UIssCOL3bE1ZjE",
  authDomain: "moviematch-8de0c.firebaseapp.com",
  projectId: "moviematch-8de0c",
  storageBucket: "moviematch-8de0c.appspot.com",
  messagingSenderId: "1036616882377",
  appId: "1:1036616882377:web:6e38b035db31b51cadd518",
  measurementId: "G-BTD4MF7YHJ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { auth, firestore };