import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB95g3wYFHBeWQqZcQo93pos-v1ebndMPg",
  authDomain: "video-chango.firebaseapp.com",
  projectId: "video-chango",
  storageBucket: "video-chango.appspot.com",
  messagingSenderId: "917892698445",
  appId: "1:917892698445:web:daf1d0b669c17cbf236704",
  measurementId: "G-NQ3F2Z6S5J",
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export { firestore };
