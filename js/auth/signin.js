console.log("Signup JS integrated");

// Config and Initialize Firebase
import {
  auth,
  signInWithEmailAndPassword,
  database,
  ref,
  get,
} from "../config/firebase-config.js";

let userid;
let userData;
let acc_type;
let userAcc;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.log("import firebaseConfig === ");

const signinForm = document.getElementById("signin-form");

// Regular expressions for validation
// Email Regex: It should not start or end with whitespace.
// It should have one "@" symbol in the middle.
// It should have at least one character before and after the "@" symbol.
// It should have at least one character after the last "." symbol.
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// Open page
function openpage(redirectPage) {
  let current_url = window.location;
  console.log("current_url main === ", current_url);
  current_url = current_url.href.substring(
    0,
    current_url.href.lastIndexOf("auth")
  );
  console.log("current_url === ", current_url);
  setTimeout(() => {
    current_url = current_url + redirectPage;
    console.log("current_url === ", current_url);
    window.location.replace(current_url);
  }, 2000);
}

// Function to get data from Firebase Realtime Database using user ID
// function getDataByUserId(userId) {
//     ref('users/' + userId);
//     dbRef.child("users").child(userId).get().then((snapshot) => {
//         const userData = snapshot.val();

//         if (userData) {
//           // Data exists for the user ID
//           console.log(userData);
//           return userData;
//         } else {
//           // Data doesn't exist for the user ID
//           console.log('User ID not found in the database.');
//           return false;
//         }
//     }).catch((error) => {
//         console.error(error);
//     });
// }

async function getDataByUserId(userId) {
  try {
    const snapshot = await get(ref(database, "users/" + userId));
    // Data snapshot contains the data at the specified location
    userData = snapshot.val();
    return userData;
  } catch (error) {
    console.error("Error getting data:", error);
    return false;
  }
}

// Function to display error message for an input field
function showError(inputElement, errorMessage) {
  const errorElement = document.getElementById(inputElement.id + "Error");
  errorElement.textContent = errorMessage;

  // Add the .error class to the input element
  errorElement.classList.add("error");
  console.log(
    " inputElement.classList.add('error') = ",
    errorElement,
    errorElement.classList.add("error")
  );
}

// Function to clear error message for an input field
function clearError(inputElement) {
  const errorElement = document.getElementById(inputElement.id + "Error");
  errorElement.textContent = "";

  // Remove the .error class from the input element
  errorElement.classList.remove("error");
  console.log(
    "inputElement.classList.remove('error'); = ",
    errorElement.classList.remove("error")
  );
}

// Function to validate the form on submission
function validateForm(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  acc_type = document.querySelector('input[name="acc_type"]:checked');

  console.log("username = ", username);
  console.log("email = ", email);
  console.log("password = ", password);

  // Validate username
  if (username.trim() === "") {
    showError(document.getElementById("username"), "Username is required.");
  } else {
    clearError(document.getElementById("username"));
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

  console.log(
    "!document.querySelector.error ==== ",
    document.querySelector("#signup-form")
  );
  if (!document.querySelector(".error")) {
    // Submit the form or do any other required action here
    console.log("Form submitted successfully!");
    // Call the function to create a user with Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User logged in Successfully!", user);
        userid = user.uid;
        // localStorage.setItem("userid",userid);
        getDataByUserId(userid)
          .then((userData) => {
            if (userData) {
              // Data exists for the user ID
              console.log("User Data", userData);
              console.log("User Data ACCType", userData.acc_type);
              if (userData.acc_type === "user") {
                alert(
                  "User logged in Successfully!\nYou are redirected to User Purchase Corner"
                );
                userAcc = {
                    id:userid,
                    acc_type:acc_type
                };
                localStorage.setItem("userAcc",JSON.stringify(userAcc));
                window.location.href = '../purchase/purchase.html';
                // openpage("sale/sale.html"); // Redirect to the sales page
              } else if (userData.acc_type === "admin") {
                console.log("User Data ACCType", userData.acc_type);
                localStorage.setItem("userAcc",JSON.stringify(userAcc));
                window.location.href = './admin/sale-product.html';
                alert(
                  "User logged in Successfully!\nYou are redirected to Admin Corner"
                );
                // openpage("purchase/purchase.html"); // Redirect to the purchase page
              } else {
                alert("Invalid Credential!");
              }
            } else {
              alert("Invalid Credential!");
            }
          })
          .catch((error) => {
            // Handle any errors that may occur during the data retrieval
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
      });
  }
}

// Attach form validation function to the form's submit event
signinForm.addEventListener("submit", validateForm);

const registerLink = document.getElementById('registerLink');

registerLink.addEventListener('click', () => {
  // Replace 'target_page.html' with the path of the page you want to open
  window.location.href = './signup.html';
});

