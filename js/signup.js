console.log("Signup JS integrated");

// Config and Initialize Firebase
import {
  auth,
  createUserWithEmailAndPassword,
} from "./config/firebase-config.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.log("import firebaseConfig === ");

const signupForm = document.getElementById("signup-form");

// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// const contactRegex = /^(?!\d{12,})\d{11}$/;

// Function to display error message for an input field
function showError(inputElement, errorMessage) {
  const errorElement = document.getElementById(inputElement.id + "Error");
  errorElement.textContent = errorMessage;
}

// Function to clear error message for an input field
function clearError(inputElement) {
  const errorElement = document.getElementById(inputElement.id + "Error");
  errorElement.textContent = "";
}

// Function to validate the form on submission
function validateForm(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const contact = document.getElementById("contact").value;

  console.log("username = ", username);
  console.log("email = ", email);
  console.log("password = ", password);
  console.log("contact = ", contact);
  console.log("contact Actual length = " + contact.length + "Contact is not 11 digit");
  // Validate username
  if (username.trim() === "") {
    showError(document.getElementById("username"), "Username is required.");
  } else {
    clearError(document.getElementById("username"));
  }

  // Validate email
  if (email.trim() === "") {
    showError(document.getElementById("email"), "Email is required.");
  } else if (!emailRegex.test(email.trim())) {
    showError(document.getElementById("email"), "Invalid email format.");
  } else {
    clearError(document.getElementById("email"));
  }

  // Validate password
  if (password.trim() === "") {
    showError(document.getElementById("password"), "Password is required.");
  } else if (!passwordRegex.test(password)) {
    showError(
        document.getElementById("password"),
      "Password must be at least 8 characters long and contain at least one letter and one number."
    );
  } else {
    clearError(document.getElementById("password"));
  }

  // Validate contact
  if (contact.trim() === "") {
    console.log("contact Actual length = " + contact.length + "Contact is not 11 digit", contact.length != 11);
    showError(document.getElementById("contact"), "Contact is required.");
  } else if(contact.length != 11 ) {
    console.log("contact Actual length = " + contact.length + "Contact is not 11 digit", contact.length != 11);
    showError(
      document.getElementById("contact"),
      "Contact must be exactly 11 digits."
    );
    clearError(document.getElementById("contact"));
  }else if(isNaN(Number(contact)))  {
    showError(
      document.getElementById("contact"),
      "Contact must be 0-9 Numbers"
    );
    clearError(document.getElementById("contact"));
  }

  if (!document.querySelector(".error")) {
    // Submit the form or do any other required action here
    console.log("Form submitted successfully!");
    // Call the function to create a user with Firebase Authentication
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
  }
}

// Attach form validation function to the form's submit event
signupForm.addEventListener("submit", validateForm);
