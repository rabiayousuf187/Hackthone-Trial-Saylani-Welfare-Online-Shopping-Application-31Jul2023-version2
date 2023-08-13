import { isAuth } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
  console.log("Add Item Page");

  document.getElementById("Top").style.display = "block";
  // Use the Firebase Configuration functions
  const {
    auth,
    createUserWithEmailAndPassword,
    database,
    ref,
    set,
    getStorage,
    storageRef,
  } = firebaseExports;

  let current_page = document.getElementById("add-item");
  // console.log("current_page color change", current_page);
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

    const fileimg = document.getElementById("itemimg").files[0];
    const itemname = document.getElementById("itemname").value;
    const itemCategorySelect = document.getElementById("itemcategory");
    const itemcontent = document.getElementById("itemcontent").value;
    const unitname = document.getElementById("unitname").value;
    const unitprice = document.getElementById("unitprice").value;
    let acc_type, userAcc, selectedCategory;
    // let acc_type = document.querySelector('input[name="acc_type"]:checked');

    console.log("fileimg = ", fileimg);

    // File Img Valid
    if (fileimg) {
      // Validate image type
      if (!fileimg.type.startsWith("image/")) {
        console.log("Please select a valid image fileimg.");
        // alert("Please select a valid image fileimg.");
        return;
      }

      // Validate image size (in bytes)
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (fileimg.size > maxSize) {
        console.log(
          "Selected image is too large. Please choose a smaller image."
        );
        // alert("Selected image is too large. Please choose a smaller image.");
        return;
      }

      // Now you can proceed with uploading the image or other actions
      console.log("Image is valid:", fileimg.name, fileimg.type, fileimg.size);
      // Your upload logic here
      clearError(document.getElementById("fileimg"));
    } else {
      // alert("Please select an image file.");
      console.log("Please select an image file.");
      showError(document.getElementById("itemimg"), "Image File is required.");
    }

    // Validate username
    if (itemname.trim() === "") {
      showError(document.getElementById("itemname"), "Item Name is required.");
    } else {
      clearError(document.getElementById("itemname"));
    }

    // Dropdown Valid
    itemCategorySelect.addEventListener("change", function () {
      selectedCategory = itemcategory.value;
      console.log("selectedCategory ==== ", selectedCategory);
    });
    if (
      selectedCategory === "Select Category" ||
      selectedCategory === undefined
    ) {
      // Handle case when the default "Select Category" is chosen
      console.log("No category selected");
      showError(
        document.getElementById("itemcategory"),
        "Item Category is required."
      );
    } else {
      console.log("Selected Category:", selectedCategory);
      clearError(document.getElementById("itemcategory"));
    }

    // Valid content
    if (itemcontent.trim() === "") {
      showError(document.getElementById("itemcontent"), "Item content is required.");
    } else {
      clearError(document.getElementById("itemcontent"));
    }
        // Valid Unit
    if (unitname.trim() === "") {
      showError(document.getElementById("unitname"), "Item Unit is required.");
    } else {
      clearError(document.getElementById("unitname"));
    }

    // Valid Price
    if (unitprice.trim() === "") {
      showError(
        document.getElementById("unitprice"),
        "Item Price is required."
      );
    } else {
      clearError(document.getElementById("unitprice"));
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
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error, error.message, error.code);
        });
    }
  }

  // Attach form validation function to the form's submit event
  addProductionbtn.addEventListener("click", validateForm);
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
