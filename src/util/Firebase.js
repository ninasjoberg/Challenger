import firebase from 'firebase';

  // Initialize Firebase
const config = {
    apiKey: "AIzaSyAwLx0kEBJnsSljXI7bqJIWYrlS7qxg2eE",
    authDomain: "challenge-app-4faf7.firebaseapp.com",
    databaseURL: "https://challenge-app-4faf7.firebaseio.com",
    projectId: "challenge-app-4faf7",
    storageBucket: "",
    messagingSenderId: "812580082038"
  };
  firebase.initializeApp(config);

  export default firebase;