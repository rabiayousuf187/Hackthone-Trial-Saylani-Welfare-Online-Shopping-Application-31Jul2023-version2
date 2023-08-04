console.log("Signup JS integrated");

// Config and Initialize Firebase
import {
    auth,
    createUserWithEmailAndPassword,
    database, ref, set, push
} from "./config/firebase-config.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.log("import firebaseConfig === ");

const signupForm = document.getElementById("signup-form");

// Regular expressions for validation
// Email Regex: It should not start or end with whitespace.
// It should have one "@" symbol in the middle.
// It should have at least one character before and after the "@" symbol.
// It should have at least one character after the last "." symbol.
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const contactRegex = /^\d{11}$/;

// Function to display error message for an input field
function showError(inputElement, errorMessage) {
    const errorElement = document.getElementById(inputElement.id + "Error");
    errorElement.textContent = errorMessage;

    // Add the .error class to the input element
    errorElement.classList.add('error');
    console.log(" inputElement.classList.add('error') = ",  errorElement, errorElement.classList.add('error'));

}

// Function to clear error message for an input field
function clearError(inputElement) {
    const errorElement = document.getElementById(inputElement.id + "Error");
    errorElement.textContent = "";

    // Remove the .error class from the input element
    errorElement.classList.remove('error');
    console.log("inputElement.classList.remove('error'); = ", errorElement.classList.remove('error'));
}

// Function to validate the form on submission
function validateForm(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const contact = document.getElementById("contact").value;
    let acc_type = document.querySelector('input[name="acc_type"]:checked');

    console.log("username = ", username);
    console.log("email = ", email);
    console.log("password = ", password);
    console.log("contact = ", contact);

    // Validate username
    if (username.trim() === "") {
        showError(document.getElementById("username"), "Username is required.");
    } else {
        clearError(document.getElementById("username"));

    }

    // Validate contact
    const contactInput = contact.trim();
    if (!contactRegex.test(contactInput)) {
        console.log("Contact must be exactly 11 digits.");
        showError(
            document.getElementById("contact"),
            "Contact must be exactly 11 digits."
        );
    } else if (contactInput === "") {
        console.log("Contact is required.");
        showError(document.getElementById("contact"), "Contact is required.");
    } else {
        clearError(document.getElementById("contact"));
    }

    // Validate emailconsole.log("Email Value on change ==", )
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

    // Selected Account Type
    if (username.trim() === "") {
        showError(document.getElementById("username"), "Username is required.");
    } else {
        clearError(document.getElementById("username"));

    }
    if (acc_type) {
        console.log("Selected Account Type:", acc_type.value);
        clearError(document.getElementById("radio_acc_type"));
        acc_type = acc_type.value;
    } else {
        console.log("Please select a Account Type.");
        showError(
            document.getElementById("radio_acc_type"),
            "Account Type is required."
        );
    }


    console.log("!document.querySelector.error ==== ", document.querySelector("#signup-form"));
    console.log("!document.querySelector.error ==== ", !document.querySelector(".error"));
    if (!document.querySelector(".error")) {
        // Submit the form or do any other required action here
        console.log("Form submitted successfully!");
        // Call the function to create a user with Firebase Authentication
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("User Created", user);
                writeUserData(user.uid, username, email, password, contact, acc_type)
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

function writeUserData(userId, username, email, password, contact, acc_type) {

    // Create a reference to the Firebase Realtime Database
    // Push data to the database
    set(ref(database, 'users/' + userId), {
        userId: userId,
        username: username,
        email: email,
        password: password,
        contact: contact,
        acc_type: acc_type
    })
        .then(() => {
            console.log("Data saved to Firebase Database.");
            // Do any further actions after data has been saved successfully.
        })
        .catch((error) => {
            console.error("Error saving data:", error);
        });
}
