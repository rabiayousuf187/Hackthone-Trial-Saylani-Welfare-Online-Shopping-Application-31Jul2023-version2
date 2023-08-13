import { isAuth } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
    console.log("Add Item Page");

    document.getElementById("Top").style.display = "block";
      // Use the Firebase Configuration functions
  const { auth, createUserWithEmailAndPassword, database, ref, set, getStorage } =
  firebaseExports;

  let current_page = document.getElementById("add-item");
  console.log("current_page color change", current_page);
  current_page.querySelector("i").style.color = "#61B846";
  current_page.querySelector("p").style.color = "#61B846";

  let home = document.getElementById("home");
  home.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./sale-product.html";
  });

  let acc_setting = document.getElementById("acc-setting");
  acc_setting.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./account-setting.html";
  });
  let order = document.getElementById("order");
  order.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./order.html";
  });

  const addProductionbtn = document.getElementById("add-production");

    // Function to validate the form on submission
    function validateForm(event) {
        event.preventDefault();
    
        const fileimg = document.getElementById("itemimg");
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const contact = document.getElementById("contact").value;
        let acc_type, userAcc;
        // let acc_type = document.querySelector('input[name="acc_type"]:checked');
    
        console.log("fileimg = ", fileimg.file[0]);
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
    
        if (username.includes("admin")) {
          console.log("Substring found!");
          acc_type = "admin";
        } else {
          acc_type = "user";
        }
    
        // if (acc_type) {
        //     console.log("Selected Account Type:", acc_type.value);
        //     clearError(document.getElementById("radio_acc_type"));
        //     acc_type = acc_type.value;
        // } else {
        //     console.log("Please select a Account Type.");
        //     showError(
        //         document.getElementById("radio_acc_type"),
        //         "Account Type is required."
        //     );
        // }
    
        console.log(
          "!document.querySelector.error ==== ",
          document.querySelector("#signup-form")
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
              writeUserData(user.uid, username, email, password, contact, acc_type)
                .then(() => {
                  userAcc = {
                    userId: user.uid,
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
    
              // // .then((writedb) => {
              // userAcc = {
              //   userId: user.uid,
              //   acc_type: acc_type,
              // };
              // localStorage.setItem("userAcc", JSON.stringify(userAcc));
              // alert("User Created Successfully! ");
              // if (acc_type === "user") {
              //   alert("You are redirected to User Purchase Corner");
              //   window.location.href = "../purchase/purchase.html";
              //   // openpage("sale/sale.html"); // Redirect to the sales page
              // } else if (acc_type === "admin") {
              //   console.log("User Data ACCType", acc_type);
              //   window.location.href = "./admin/sale-product.html";
              //   alert("You are redirected to Admin Corner");
              //   // openpage("purchase/purchase.html"); // Redirect to the purchase page
              // } else {
              //   alert("Invalid Credential!");
              // }
              // })
              // .catch((error) => {
              //   // Handle any errors that may occur during the data retrieval
              //   console.error("Error:", error);
              // });
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(error, error.message, error.code);
            });
        }
      }

      
  // Attach form validation function to the form's submit event
  addProductionbtn.addEventListener("submit", validateForm);


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
