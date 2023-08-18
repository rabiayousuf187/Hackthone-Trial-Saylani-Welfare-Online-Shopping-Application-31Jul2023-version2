import { isAuth } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
  console.log("Add Item Page");

  document.getElementById("Top").style.display = "block";
  document.getElementById("adminname").innerText = userAcc.fullname;
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

  let file;
  const addClickListener = (elementId, destination) => {
    const element = document.getElementById(elementId);
    element.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = destination;
    });
  };

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

  let writeItemData = (
    downloadURL,
    itemname,
    selectedCategory,
    itemcontent,
    unitname,
    unitprice
  ) => {
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
  };

  let current_page = document.getElementById("add-item");
  // console.log("current_page color change", current_page);
  current_page.querySelector("i").style.color = "#61B846";
  current_page.querySelector("p").style.color = "#61B846";

  addClickListener("home", "./admin.html");
  addClickListener("acc-setting", "./account-setting.html");
  addClickListener("order", "../order.html");

  const addProductionbtn = document.getElementById("add-production");

  // Function to display error message for an input field
  let showError = (inputElement, errorMessage) => {
    const errorElement = document.getElementById(inputElement.id + "Error");
    errorElement.textContent = errorMessage;

    // Add the .error class to the input element
    errorElement.classList.add("error");
    console.log(
      " inputElement.classList.add('error') = ",
      errorElement,
      errorElement.classList.add("error")
    );
  };

  // Function to clear error message for an input field
  let clearError = (inputElement) => {
    const errorElement = document.getElementById(inputElement.id + "Error");
    errorElement.textContent = "";

    // Remove the .error class from the input element
    errorElement.classList.remove("error");
    console.log(
      "inputElement.classList.remove('error'); = ",
      errorElement.classList.remove("error")
    );
  };

  let fileimg = document.getElementById("itemimg");
  let itemname = document.getElementById("itemname")
  let itemCategorySelect = document.getElementById("itemcategory");
  let selectedCategory = itemCategorySelect.value
  let itemcontent = document.getElementById("itemcontent")
  let unitname = document.getElementById("unitname")
  let unitprice = document.getElementById("unitprice")


  function validateItemImg() {
    // Perform validation logic for item name
    console.log("fileimg.file[0]; ===== ", fileimg.files[0]);
    file = fileimg.files[0];
    if (file) {
      // Validate image type
      if (!file.type.startsWith("image/")) {
        console.log("Please select a valid image fileimg.");
        // alert("Please select a valid image fileimg.");
        return;
      }

      // Validate image size (in bytes)
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        console.log(
          "Selected image is too large. Please choose a smaller image."
        );
        // alert("Selected image is too large. Please choose a smaller image.");
        return;
      }

      // Now you can proceed with uploading the image or other actions
      console.log("Image is valid:", file.name, file.type, file.size);
      // Your upload logic here
      clearError(document.getElementById("itemimg"));
    } else {
      // alert("Please select an image file.");
      console.log("Please select an image file.");
      showError(document.getElementById("itemimg"), "Image File is required.");
    }
    
  }

  // Validation functions
  function validateItemName() {
     // Dropdown Valid
     itemname = itemname.value;
    // Valid content
    if (itemname.trim() === "") {
      showError(
        document.getElementById("itemname"),
        "Item content is required."
      );
    } else {
      clearError(document.getElementById("itemcontent"));
    }
  }

  function validateItemContent() {
    // Perform validation logic for item content
        // Valid content
     itemcontent = itemcontent.value;
        if (itemcontent.trim() === "") {
          showError(
            document.getElementById("itemcontent"),
            "Item content is required."
          );
        } else {
          clearError(document.getElementById("itemcontent"));
        }
  }

  function validateUnitName() {
    // Perform validation logic for unit name
     // Valid Unit
     
     unitname = unitname.value;
     if (unitname.trim() === "") {
      showError(document.getElementById("unitname"), "Item Unit is required.");
    } else {
      clearError(document.getElementById("unitname"));
    }
  }

  function validateUnitPrice() {
    // Perform validation logic for unit price
    
    unitprice = unitprice.value;
    // Valid Price
    if (unitprice.trim() === "") {
      showError(
        document.getElementById("unitprice"),
        "Item Price is required."
      );
    } else {
      clearError(document.getElementById("unitprice"));
    }

  }


  // Add an event listener for each input field
  fileimg.addEventListener("change", validateItemImg);
  itemname.addEventListener("change", validateItemName);
  itemcontent.addEventListener("change", validateItemContent);
  unitname.addEventListener("change", validateUnitName);
  unitprice.addEventListener("change", validateUnitPrice);

  
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
  const showElement = (elementId, display = "block") => {
    document.getElementById(elementId).style.display = display;
  };

  // Open page
  let openpage = (redirectPage, pagename) => {
    setTimeout(() => {
      alert("Redirtected to " + pagename);
      window.location.href = redirectPage;
    }, 800);
  };


  let replaceSpacesWithHyphens = (text) => {
    // Replace spaces with hyphens using regular expression
    text = text.trim(text);
    return text.replace(/\s+/g, "-");
  };
  function capitalizeWords(str) {
    return str.replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
  }

  const container = document.getElementById("itemcategory");
  container.insertAdjacentHTML("beforeend", `<option selected value="Select Category">Select Category</option>`);
  let addElement = (ind, category, imageURL) => {
    let link = replaceSpacesWithHyphens(category);
    category = capitalizeWords(category);

    const itemHTML = `
      <option value="${link}">${category}</option>`;

    container.insertAdjacentHTML("beforeend", itemHTML);
  };

  const itemsData = JSON.parse(localStorage.getItem("category"));

  console.log("container ===== ", container)
  itemsData.forEach((ele, ind) => {
    console.log("Each Item ==== :", ele);
    console.log("Each Item ==== :", ele.categoryName, ele.imageUrl);

    // Call the function to add a fruit item
    // name, weight, price, imageURL
    addElement(ind, ele.categoryName, ele.imageUrl);

    // if(!isFirstLoad) {
    const lazyImages = document.querySelectorAll(".lazy-image");
    const loadImagePromises = [];
    lazyImages.forEach((img) => {
      const promise = new Promise((resolve) => {
        img.addEventListener("load", () => {
          resolve();
        });
        img.src = img.getAttribute("data-src");
      });
      loadImagePromises.push(promise);
    });
    Promise.all(loadImagePromises)
      .then(() => {
        console.log("All lazy-loaded images are loaded.");
        setTimeout(() => {
          console.log("Page Completely Loaded");
          showElement("header");
          showElement("cat-section");
          showElement("footer");
        }, 3000);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  });

  function validateForm(event) {
    event.preventDefault();

    let fileimg = document.getElementById("itemimg").files[0];
    let itemname = document.getElementById("itemname").value;
    let itemCategorySelect = document.getElementById("itemcategory");
    let selectedCategory = itemCategorySelect.value;
    let itemcontent = document.getElementById("itemcontent").value;
    let unitname = document.getElementById("unitname").value;
    let unitprice = document.getElementById("unitprice").value;

    
    let acc_type, userAcc;
    // let acc_type = document.querySelector('input[name="acc_type"]:checked');

    console.log("fileimg = ", fileimg);

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

      if (
        !fileimg ||
        !itemname ||
        !selectedCategory ||
        !itemcontent ||
        !unitname ||
        !unitprice
      ) {
        alert("Refill Form for all Feilds\nSome Feilds are undefined.");
        console.log("Refill Form for all Feilds\nSome Feilds are undefined.");
      } else {
        console.log("All feilds are well defined.");
        // Store Img to Firebase Storage
        saveImg(fileimg, itemname, selectedCategory)
          .then((downloadURL) => {
            console.log("GET downloadURL === , ", downloadURL);
            if (downloadURL) {
              console.log(
                "Data before write === ",
                downloadURL,
                itemname,
                selectedCategory,
                itemcontent,
                unitname,
                unitprice
              );
              writeItemData(
                downloadURL,
                itemname,
                selectedCategory,
                itemcontent,
                unitname,
                unitprice
              )
                .then(() => {
                  document.getElementById("itemname").value = "";
                  document.getElementById("itemcategory").value =
                    "Select Category";
                  document.getElementById("itemcontent").value = "";
                  document.getElementById("unitname").value = "";
                  document.getElementById("unitprice").value = "";
                  document.getElementById("itemimg").value = null; // Clear file input

                  window.location.href = `../admin/category/${selectedCategory}.html`;
                })
                .catch((error) => {
                  console.error("Error Adding Item data:", error);
                });
            } else {
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
