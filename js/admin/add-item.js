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
    storage,
    storageRef,
    uploadBytes,
    getDownloadURL,
  } = firebaseExports;

  let saveImg = (file, itemname, selectedCategory) => {
    return new Promise((resolve, reject) => {
      const imageRef = storageRef(
        storage,
        `images/${selectedCategory}/${itemname}/${file.name}`
      );

      uploadBytes(imageRef, file)
        .then((snapshot) => {
          console.log("Image uploaded successfully");

          // Get the download URL
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve(downloadURL); // Resolve the promise with the download URL
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          reject(error); // Reject the promise with the error
        });
    });
  };

  function writeItemData(
    downloadURL,
    itemname,
    selectedCategory,
    itemcontent,
    unitname,
    unitprice
  ) {
    return new Promise((resolve, reject) => {
      // Create a reference to the Firebase Realtime Database
      // Push data to the database
      set(ref(database, `items/${selectedCategory}/${itemname}/`), {
        itemName: itemname,
        itemCategory: selectedCategory,
        itemContent: itemcontent,
        unitName: unitname,
        unitPrice: unitprice,
        imageUrl: downloadURL, // Store the image URL here
      })
        .then(() => {
          console.log("Data saved to Firebase Database. with Img");
          resolve(); // Resolve the promise to indicate success
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          reject(error); // Reject the promise with the error
        });
    });
  }
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
  let itemCategorySelect = document.getElementById("itemcategory");
  let selectedCategory;
  // Adding the event listener for the itemCategorySelect
  itemCategorySelect.addEventListener("change", function () {
    selectedCategory = itemCategorySelect.value; // Corrected variable name
    console.log("selectedCategory ==== ", selectedCategory);

    if (selectedCategory === "Select Category" || selectedCategory === "") {
      // Handle case when the default "Select Category" is chosen or if the value is empty
      console.log("No category selected");
      showError(
        document.getElementById("itemcategory"),
        "Item Category is required."
      );
    } else {
      console.log("Selected Category:", selectedCategory);
      clearError(document.getElementById("itemcategory"));
    }
  });
  // Function to validate the form on submission
  function validateForm(event) {
    event.preventDefault();

    const fileimg = document.getElementById("itemimg").files[0];
    const itemname = document.getElementById("itemname").value;
    // const itemCategorySelect = document.getElementById("itemcategory");
    const itemcontent = document.getElementById("itemcontent").value;
    const unitname = document.getElementById("unitname").value;
    const unitprice = document.getElementById("unitprice").value;
    let acc_type, userAcc;
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
      clearError(document.getElementById("itemimg"));
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

    // Valid content
    if (itemcontent.trim() === "") {
      showError(
        document.getElementById("itemcontent"),
        "Item content is required."
      );
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

    console.log(
      "!document.querySelector.error ==== ",
      !document.querySelector(".error")
    );

    if (!document.querySelector(".error")) {
      // Submit the form or do any other required action here
      console.log("Form submitted successfully!");
      console.log(
        "Data before write === ",
        itemname,
        selectedCategory,
        itemcontent,
        unitname,
        unitprice
      );

      // Store Img to Firebase Storage
      saveImg(fileimg, itemname, selectedCategory)
      .then((downloadURL) => {
          console.log("GET downloadURL === , ", downloadURL);
          if (downloadURL) {
            console.log("Data before write === ", downloadURL,itemname,selectedCategory,itemcontent,unitname,unitprice);
            writeItemData(downloadURL,itemname,selectedCategory,itemcontent,unitname,unitprice)
            .then(() => {
              window.location.href = `../admin/category/${selectedCategory}.html`;
            })
            .catch((error) => {
              console.error("Error Adding Item data:", error);
            });
          }
          else {
            console.log("No DownloadURL RX.");
          }
        })
        .catch((error) => {
          // Handle any errors that may occur during the data retrieval
          console.error("Error:", error);
        });

      // userAcc = {
      //   userId: user.uid,
      //   acc_type: acc_type,
      // };
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
