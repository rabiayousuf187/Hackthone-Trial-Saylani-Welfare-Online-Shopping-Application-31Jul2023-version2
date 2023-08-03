console.log("Signup JS integrated")

// Import the functions you need from the SDKs you need

import { firebaseConfig } from "./config/firebase-config.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// let firebaseConfig = firebase_settings.firebaseConfig;

console.log("import firebaseConfig === ", firebaseConfig);
// initializeApp()
firebase.initializeApp(firebaseConfig);

    signUpForm.addEventListener("submit", (e) => {
        console.log("Form Submit!");

        e.preventDefault();
        const email = signUpForm.email.value;
        const password = signUpForm.password.value;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // User signed up successfully
                console.log("User signed up:", userCredential.user);
            })
            .catch((error) => {
                // Handle signup errors
                console.error("Error signing up:", error);
            });
    });

