import { isAuth } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
  console.log("Admin Account Setting Page");

  document.getElementById("Top").style.display = "block";
  //   document.getElementById("adminname").innerText = userAcc.fullname;
  // Use the Firebase Configuration functions
  const {
    database,
    ref,
    set,
    storage,
    storageRef,
    uploadBytes,
    getDownloadURL,
  } = firebaseExports;

  const addClickListener = (elementId, destination) => {
    const element = document.getElementById(elementId);
    element.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = destination;
    });
  };

  let current_page = document.getElementById("acc-setting");
  console.log("current_page color change", current_page);
  current_page.querySelector("img").style.filter =
    "invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)";
  current_page.querySelector("p").style.color = "#61B846";

  addClickListener("home", "./admin.html");
  addClickListener("add-item", "./add-item.html");


// Update FullName
const updatefname = document.getElementById("update-fullname");
  // Function to validate the form on submission
  function validateForm(event) {
    event.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const contact = document.getElementById("contact").value;
    let acc_type, userAcc;
    // let acc_type = document.querySelector('input[name="acc_type"]:checked');

    console.log("fullname = ", fullname);
    console.log("username = ", username);
    console.log("email = ", email);
    console.log("password = ", password);
    console.log("contact = ", contact);

    // Validate fullname
    if (fullname.trim() === "") {
      showError(document.getElementById("fullname"), "fullname is required.");
    } else if (!fullnameRegex.test(fullname.trim())) {
      console.log("Invalid: Contains only letters and spaces.");
      showError(document.getElementById("fullname"), "Invalid: Contains only letters and spaces.");
    } else {
      console.log("Valid: Contains only letters and spaces.");
      clearError(document.getElementById("fullname"));
    }

    console.log(
      "!document.querySelector.error ==== ",
      document.querySelector("#fullname-div")
    );
    console.log(
      "!document.querySelector.error ==== ",
      !document.querySelector(".error")
    );
    if (!document.querySelector(".error")) {
      // Submit the form or do any other required action here
      console.log("Form submitted successfully!");
      // Call the function to create a user with Firebase Authentication
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User Role", acc_type);
          console.log("User Created", user);
          writeUserData(user.uid, fullname, username, email, password, contact, acc_type)
            .then(() => {
              userAcc = {
                userId: user.uid,
                fullname: fullname,
                acc_type: acc_type,
              };
              localStorage.setItem("userAcc", JSON.stringify(userAcc));

              if (acc_type === "user") {
                alert("You are redirected to User Purchase Corner");
                window.location.href = "../purchase/purchase.html";
              } else if (acc_type === "admin") {
                console.log("User Data ACCType", acc_type);
                alert("You are redirected to Admin Corner");
                window.location.href = "../admin/admin.html";
              } else {
                alert("Invalid Credential!");
              }
            })
            .catch((error) => {
              console.error("Error writing user data:", error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error, error.message, error.code);
        });
    }
  }

  // Attach form validation function to the form's submit event
  updatefname.addEventListener("click", validateForm);

  var logoutbtn = document.getElementById("logout");

  logoutbtn.addEventListener("click", function () {
    console.log("Logout");
    setTimeout(() => {
      logout();
    }, 1000);
  });
} else if (
  (userAcc && userAcc.acc_type === "user") ||
  userAcc === null ||
  userAcc === undefined
) {
  console.log("User is Auth but role is not Admin");
  window.location.href = "../auth/signin.html";
} else {
  console.log("Unauth User Access!");
  window.location.href = "../auth/signin.html";
}
