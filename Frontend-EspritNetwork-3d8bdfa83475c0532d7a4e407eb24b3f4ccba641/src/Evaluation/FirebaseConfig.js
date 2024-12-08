import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
	apiKey: "AIzaSyA1iHpc8dcTCd0qaZSZ_hFGHF_yPtaAowg",
	authDomain: "espritnetwork-743b0.firebaseapp.com",
	projectId: "espritnetwork-743b0",
	storageBucket: "espritnetwork-743b0.appspot.com",
	messagingSenderId: "1045637420033",
	appId: "1:1045637420033:web:6d05fe14f753c0a7aa5c00",
	measurementId: "G-JHYHY4491S",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
