console.log("Signup JS integrated");

// Config and Initialize Firebase
import {  auth,  createUserWithEmailAndPassword,} from "./config/firebase-config.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.log("import firebaseConfig === ", );

 let signup = document.getElementById('signup');
signup.addEventListener("submit", (e) => {
  console.log("Form Submit!");
  
  e.preventDefault();
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  
    console.log('Email and Password' , email, password);
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // set(ref(Database , 'user/' ),{
            //     email: email,
            //     password: password,
            // });
            console.log('User Created');
            alert('User Created');
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorMessage ,errorCode);
            // alert(errorMessage);
            // ..
        });
}); 
