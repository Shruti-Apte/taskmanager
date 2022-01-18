import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-nnxAuhuFwR5-muNI53atIz5h7rJSyes",
  authDomain: "shruti-task-manager.firebaseapp.com",
  databaseURL: "https://shruti-task-manager-default-rtdb.firebaseio.com",
  projectId: "shruti-task-manager",
  storageBucket: "shruti-task-manager.appspot.com",
  messagingSenderId: "547001950226",
  appId: "1:547001950226:web:c7bbf50b2d0afb8b6a38cb",
  measurementId: "G-K7ZYGLJ0CN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth =getAuth(app);
const storage=getStorage(app);

export {db,auth};