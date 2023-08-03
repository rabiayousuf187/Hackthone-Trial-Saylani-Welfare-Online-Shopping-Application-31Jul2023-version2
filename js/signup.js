console.log("Signup JS integrated");

// Config and Initialize Firebase
import {
  auth,
  createUserWithEmailAndPassword,
} from "./config/firebase-config.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.log("import firebaseConfig === ");

// Handle form submission
let signup_form = document.getElementById("signup-form");
signup_form.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("User Created");
      alert("User Created");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage, errorCode);
    });
});
