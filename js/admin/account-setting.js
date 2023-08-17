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

  // Update FullName
  const updatefname = document.getElementById("update-fullname");
  // Function to validate the form on submission
  let validateForm = (event) => {
    event.preventDefault();

    let acc_type;
    const fullnameRegex = /^[A-Za-z\s]+$/;

    const fullname = document.getElementById("fullname").value;
    console.log("fullname = ", fullname);

    // Validate fullname
    if (fullname.trim() === "") {
      showError(document.getElementById("fullname"), "fullname is required.");
    } else if (!fullnameRegex.test(fullname.trim())) {
      console.log("Invalid: Contains only letters and spaces.");
      showError(
        document.getElementById("fullname"),
        "Invalid: Contains only letters and spaces."
      );
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
      console.log("Form submitted successfully!");

      updateFullName(userAcc.id, fullname)
        .then(() => {
          userAcc = {
            userId: userAcc.id,
            fullname: fullname,
            acc_type: userAcc.acc_type,
          };
          localStorage.setItem("userAcc", JSON.stringify(userAcc));

          if (userAcc.acc_type === "admin") {
            console.log("User Data ACCType", userAcc.acc_type);
            alert("You are redirected to Admin Main Page");
            window.location.href = "../admin/admin.html";
          } else {
            alert("Invalid Credential!");
          }
        })
        .catch((error) => {
          console.error("Error Update Full Name data:", error);
        });
    }
  };

  // Attach form validation function to the form's submit event
  updatefname.addEventListener("click", validateForm);

  let updateFullName = (userId, fullname) => {
    return new Promise((resolve, reject) => {
      const userRef = ref(database, "users/" + userId);
      // Update specific fields within the path
      set(userRef, {
        fullname: fullname,
      })
        .then(() => {
          alert("Full Name Successfully updated to Firebase");
          console.log("Full Name Successfully updated to Firebase");
          resolve(); // Resolve the promise to indicate success
        })
        .catch((error) => {
          alert("Error update Full Name data:", error);
          console.error("Error update Full Name data:", error);
          reject(error); // Reject the promise with the error
        });
    });
  };

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
