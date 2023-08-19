import { isAuth, logout } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
  console.log("Admin Account Setting Page");

  let userData;
  document.getElementById("Top").style.display = "block";
  //   document.getElementById("adminname").innerText = userAcc.fullname;
  // Use the Firebase Configuration functions
  const {
    database,
    ref,
    set,
    get,
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


  // Get Category Data for admin
  let getAllItemData = async () => {
    try {
      const snapshot = await get(ref(database, `categories/`));
      // Data snapshot contains the data at the specified location
      let itemsData = snapshot.val();
      console.log("Retrieved data:", itemsData);
      itemsData = Object.values(itemsData);
      return itemsData;
    } catch (error) {
      console.error("Error getting data:", error);
      return false;
    }
  };
  const showElement = (elementId, display = "block") => {
    document.getElementById(elementId).style.display = display;
  };


  let replaceSpacesWithHyphens = (text) => {
    // Replace spaces with hyphens using regular expression
    text=text.trim(text);
    return text.replace(/\s+/g, '-');
  } 
  let capitalizeWords = (str) => {
    return str.replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
  }

  const container = document.getElementById("content-category");
  let addElement = (
      ind,
      category,
      imageURL,
    ) => {
      
      category = capitalizeWords(category);
      let link = replaceSpacesWithHyphens(category);
      const itemHTML = `
      <div class="cat-${ind} cat-style">
                          <button id="${link}-btn" name="${link}" value="submit" class="btn btn-get-started cat-inp"
                              onclick="openpage('./category/${link}.html', '${category} Page')">
                              <img class="lazy-image" src="../../img/icon/placeholder.png" alt="${category}" data-src="${imageURL}"/>
                              <p id="${link}">${category}</p>
                          </button>
                      </div>`;

      container.insertAdjacentHTML("afterbegin", itemHTML);
    };

    const itemsData = JSON.parse(localStorage.getItem("category"));
  itemsData.forEach((ele, ind) => {
      console.log("Each Item ==== :", ele);
      console.log( "Each Item ==== :",ele.categoryName,ele.imageUrl);

      // Call the function to add a fruit item
      // name, weight, price, imageURL
      addElement(
        ind,
        ele.categoryName,
        ele.imageUrl
      );

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


  let current_page = document.getElementById("acc-setting");
  console.log("current_page color change", current_page);
  current_page.querySelector("img").style.filter =
    "invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)";
  current_page.querySelector("p").style.color = "#61B846";

  addClickListener("home", "./admin.html");
  addClickListener("add-item", "./add-item.html");

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

  // Update FullName
  const updatefname = document.getElementById("update-fullname");
  // Function to validate the form on submission
  let validateForm = (event) => {
    event.preventDefault();

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

      getDataByUserId(userAcc.id)
        .then((userData) => {
          console.log("GET userData === , ", userData);
        //   update User Full Name
            updateFullName(userData, fullname)
            .then(() => {
            userAcc = {
                id: userAcc.id,
                fullname: fullname,
                acc_type: userAcc.acc_type,
            };
            localStorage.setItem("userAcc", JSON.stringify(userAcc));
                alert("You are redirected to Admin Main Page");
                
                window.location.href = "../admin/admin.html";
            
            })
            .catch((error) => {
            console.error("Error Update Full Name data:", error);
            });
        })
        .catch((error) => {
          // Handle any errors that may occur during the data retrieval
          console.error("Error:", error);
        });
      
    }
  };

  // Attach form validation function to the form's submit event
  updatefname.addEventListener("click", validateForm);

  let updateFullName = (userData, newfullname) => {
    const {acc_type,contact,email,password,userId,username, fullname} = userData;
 
    return new Promise((resolve, reject) => {
      const userRef = ref(database, "users/" + userId);
      // Update specific fields within the path
      set(userRef, {
            userId: userId,
            fullname: newfullname,
            username: username,
            email: email,
            password: password,
            contact: contact,
            acc_type: acc_type
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

  //   Add Categories
  const addCatBtn = document.getElementById("add-cat-form");

  // Function to validate the form on submission
  let validateAddCat = (event) => {
    event.preventDefault();

    const fileimg = document.getElementById("itemimg").files[0];
    const categoryname = document.getElementById("categoryname").value;
    const categorynameRegex = /^[A-Za-z\s]+$/;

    console.log("categoryname = ", categoryname);
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

    // Validate fullname
    if (categoryname.trim() === "") {
      showError(
        document.getElementById("categoryname"),
        "categoryname is required."
      );
    } else if (!categorynameRegex.test(categoryname.trim())) {
      console.log("Invalid: Contains only letters and spaces.");
      showError(
        document.getElementById("categoryname"),
        "Invalid: Contains only letters and spaces."
      );
    } else {
      console.log("Valid: Contains only letters and spaces.");
      clearError(document.getElementById("categoryname"));
    }

    console.log(
      "!document.querySelector.error ==== ",
      !document.querySelector(".error")
    );

    if (!document.querySelector(".error")) {
      // Submit the form or do any other required action here
      console.log("Form submitted successfully!");
      console.log("Data before write === ", categoryname);

      if (!fileimg || !categoryname) {
        alert("Refill Form for all Feilds\nSome Feilds are undefined.");
        console.log("Refill Form for all Feilds\nSome Feilds are undefined.");
      } else {
        console.log("All feilds are well defined.");
        // Store Img to Firebase Storage
        saveImg(fileimg, categoryname)
          .then((downloadURL) => {
            console.log("GET downloadURL === , ", downloadURL);
            if (downloadURL) {
              console.log("Data before write === ", downloadURL, categoryname);
              writeItemData(downloadURL, categoryname)
                .then(() => {
                  document.getElementById("categoryname").value = "";
                  document.getElementById("itemimg").value = null; // Clear file input
                  getAllItemData()
                  .then((category) => {
                    console.log("Retrieved data:", category);
                    localStorage.setItem(
                      "category",
                      JSON.stringify(Object.values(category))
                    );
                    localStorage.setItem("isAdminFirstLoad", "true");
                    console.log(
                      "Category Data successfully Stored in local Storage"
                    );
                    window.location.href = `../admin/admin.html`;
                  }).catch((error)=>{
                    
                  alert("Error stored item in local SSSSST:", error);
                  console.error("Error stored item in local SSSSST:", error);
                  })
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
      }
    }
  };

  let saveImg = (file, categoryname) => {
    return new Promise((resolve, reject) => {
      const imageRef = storageRef(
        storage,
        `categories/${categoryname}/${file.name}`
      );

      uploadBytes(imageRef, file)
        .then((snapshot) => {
          console.log("Cat-Image uploaded successfully");

          // Get the download URL
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("Cat-Img File available at", downloadURL);
          resolve(downloadURL); // Resolve the promise with the download URL
        })
        .catch((error) => {
          console.error("Error uploading Cat-Image:", error);
          reject(error); // Reject the promise with the error
        });
    });
  };

  let writeItemData = (downloadURL, categoryname) => {
    return new Promise((resolve, reject) => {
      // Create a reference to the Firebase Realtime Database
      // Push data to the database
      set(ref(database, `categories/${categoryname}/`), {
        categoryName: categoryname,
        imageUrl: downloadURL, // Store the image URL here
      })
        .then(() => {
          alert("Cat-Data saved to Firebase Database. with Img");
          console.log("Cat-Data saved to Firebase Database. with Img");
          resolve(); // Resolve the promise to indicate success
        })
        .catch((error) => {
          alert("Error saving Cat-data:", error);
          console.error("Error saving Cat-data:", error);
          reject(error); // Reject the promise with the error
        });
    });
  };

  // Attach form validation function to the form's submit event
  addCatBtn.addEventListener("submit", validateAddCat);

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
