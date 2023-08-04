  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
  import { getDatabase, ref, push, set  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
  // import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
  
  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAT7yf6n4tFUjvqJKJWDcJpJM26qsQ9yOg",
    authDomain: "hackthonetrial-saylani-shopapp.firebaseapp.com",
    databaseURL: "https://hackthonetrial-saylani-shopapp-default-rtdb.firebaseio.com",
    projectId: "hackthonetrial-saylani-shopapp",
    storageBucket: "hackthonetrial-saylani-shopapp.appspot.com",
    messagingSenderId: "450136022057",
    appId: "1:450136022057:web:f3d1cdd876da1333949038",
    measurementId: "G-DQZD8KB8J7"
  };

  // Initialize Firebase
  const appInitial = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(appInitial);
    // Create a reference to the Firebase Realtime Database
const database = getDatabase();
  // const analytics = getAnalytics(firebase);


  export {auth, createUserWithEmailAndPassword, database, ref, push, set};