import { isAuth, logout } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "user") {
  console.log("Admin Account Setting Page");
  let userData,
    selectedCategory,
    disableItem,
    quantity = 0, total = 0, confirmorder;

    // format number to pak rupee
    let rupee = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "PKR", // Use 'PKR' for Pakistani Rupee
    });

  let count_item = localStorage.getItem("quantity");
  count_item =
    count_item === null
      ? count_item === null
      : (count_item = JSON.parse(count_item));

  let count = () => {
    if (quantity > 0) {
      quantity++;
      console.log("count_item++ === ", quantity);
      document.getElementById("count-item").innerHTML = quantity;
      localStorage("count_item", JSON.stringify(quantity));
    }
  };
  document.getElementById("Top").style.display = "block";
  document.getElementById("adminname").innerText = userAcc.fullname;
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
  const showElement = (elementId, display = "block") => {
    document.getElementById(elementId).style.display = display;
  };

  // Check if the page has been loaded before
  const isFirstLoad = JSON.parse(localStorage.getItem("isUserFirstLoad"));

  let showItem = (
    container,
    ind,
    category,
    name,
    weight,
    price,
    imageURL,
    description,
    disabled
  ) => {
    category = capitalizeWords(category);
    let link = replaceSpacesWithHyphens(category);
    
    const itemHTML = `
    <div id="cat-${link}-${name}" class="cat-row ${
      disableItem === true ? "disable" : ""
    }"  disabled = ${disabled}>
        <div class="col-12 cat-item">
            <div class="sub-cat-title">
                <img src="${imageURL}" alt="${category}" data-src="${imageURL}" class="lazy-image"/>
                <div id="sub-cat-details-${ind}" class="sub-cat-details">
                    <p class="sub-cat-name" style="font-size: x-large;
                    font-weight: 600;">${name}</p> 
                </div>
                <div class="quantity-controls">
                    <button class="decrease">-</button>
                    <input type="number" class="quantity" value="1" min="1">
                    <button class="increase" id= 'increase'>+</button>
                </div>
                <div id="sub-cat-details-${ind}" class="sub-cat-details">
                    <p class="sub-cat-name" id ="price" style="font-size: x-large;
                font-weight: 600;">${rupee.format(price)}</p>
                </div>
                <div class="item-delete">
                    <a class="col-2 btn btn-get-started" id="${name}" disabled = ${disabled}><i class="bi bi-trash3-fill"></i></a>
                </div>
                </div>
                </div>
        </div>
    </div>`;

    container.insertAdjacentHTML("beforeend", itemHTML);
    // let updatePrice = (priceElement, quantity) => {
    //     const unitPrice = priceElement.getAttribute("price");
    //     console.log("unitPrice === ", unitPrice);
    //     console.log("unitPrice === ", unitPrice);
    //     const totalPrice = unitPrice * quantity;

    //     const rupeeFormatter = new Intl.NumberFormat('en-IN', {
    //       style: 'currency',
    //       currency: 'PKR',
    //     });

    //     priceElement.textContent = rupeeFormatter.format(totalPrice);
    //   }

    const productContainers = document.querySelector(".sub-cat-title");
    const increase = document
      .querySelector(".quantity-controls")
      .querySelector(".increase");
    increase.addEventListener("click", (event) => {
      const container = increase.closest(".cat-row");
      const quantityInput = event.target.querySelector(".quantity");

      quantityInput.value = parseInt(quantityInput.value) + 1;
      console.log("quantityInput.value === ", quantityInput.value);

      // Now you can update the price based on the new quantity
      // updatePrice(priceElement, parseInt(quantityInput.value));
    });
    // productContainers.addEventListener("click", (event) => {
    //     const increaseButton = event.target.closest(".increase");

    //   });
  };

    
  let handleButtonClick = (category) => {
    console.log("Switch category ====", category); // This will log the value of the clicked category
    // if (is)
    getAllItemData(`items/${category}/`)
      .then((itemsData) => {
        if (!itemsData) {
          console.log("Data is null");
        } else {
          window.location.href = "./purchase.html";
          alert("Redirected to Purchase Corner");
        }

        // Process the retrieved data
      })

      .catch((error) => {
        console.error("Error fetching Items Data:", error);
      });
  }

  window.addEventListener("load", () => {
    getAllItemData(`cart/${userAcc.id}/`)
      .then((itemsData) => {
        // console.log(`GET CART DATA ==`, cartData);
        // disableItem = Object.keys(cartData);

        const container = document.getElementById("show-item-inner");
        const quantity = 1;
        confirmorder = itemsData;
        itemsData.forEach((ele, ind) => {
                     
              const price = parseInt(ele.unitPrice);
              // const totalElement = input.closest(".cat-row").querySelector(".total-price");
          
              total += price * quantity;
              console.log("price ==== ", price)
              
              showItem(
                container,
                ind,
                ele.itemCategory,
                ele.itemName,
                ele.unitName,
                ele.unitPrice,
                ele.imageUrl,
                ele.itemContent,
                false
            );
            
          console.log(`${ele.itemName} not found in the array.`);
        });
        console.log("Total Price ==== ", total)
        document.getElementById('finalPrice').innerHTML = rupee.format(total);

        
        const lazyImages = document.querySelectorAll(".lazy-image");
        const loadImagePromises = [];
        lazyImages.forEach((img) => {
          //   const promise = new Promise((resolve) => {
          img.addEventListener("load", () => {
            //   resolve();
            // });
            img.src = img.getAttribute("data-src");
          });
          //   loadImagePromises.push(promise);
        });
        // Promise.all(loadImagePromises)
        //   .then(() => {
        //     console.log("All lazy-loaded images are loaded.");
        //   })
        //   .catch((error) => {
        //     console.error("An error occurred:", error);
        //   });
      })

      .catch((error) => {
        console.error("Error Getting Cart Items Data:", error);
      });
  });
  // Process the retrieved data

  let getAllItemData = async (url) => {
    try {
      let snapshot = await get(ref(database, url));
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

  let writeItemData = (
    userId,
    itemName,
    itemCategory,
    itemContent,
    unitName,
    unitPrice,
    imageUrl,
    url
  ) => {
    return new Promise((resolve, reject) => {
      // Create a reference to the Firebase Realtime Database
      // Push data to the database
      set(ref(database, url), {
        itemName: itemName,
        itemCategory: itemCategory,
        itemContent: itemContent,
        unitName: unitName,
        unitPrice: unitPrice,
        imageUrl: imageUrl, // Store the image URL here
      })
        .then(() => {
          // alert("Item ", itemName, "added to cart")
          console.log("Item Added to  Cart Database. with Img");
          resolve(); // Resolve the promise to indicate success
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          reject(error); // Reject the promise with the error
        });
    });
  };

  
  let getSelectedItemData = async (url) => {
    try {
      let snapshot = await get(ref(database, url));
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
  let addCart = (category, link) => {
    console.log(`Selected Category ${category}, Item ${link} saved into cart`);

    getSelectedItemData(`cart/${userAcc.id}/`)
      .then((itemsData) => {
        if (!itemsData) {
          console.log("Data is null");
        } else {
          // Here you can continue with rendering your data or performing other tasks
          confirmorder = itemsData;
          console.log("confirmorder === ", confirmorder)
        }
      })
      .catch((error) => {
        console.error("Error getting Item data:", error);
      });
  };

  // Function to update the displayed price based on quantity
  let updatePrice = (priceElement, quantity) => {
    const unitPrice = parseFloat(priceElement.getAttribute("data-price")); // Get the unit price from data attribute
    const totalPrice = unitPrice * quantity;
    const rupeeFormatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "PKR", // Use 'PKR' for Pakistani Rupee
    });
    priceElement.textContent = rupeeFormatter.format(totalPrice); // Update the displayed price
  };
  let replaceSpacesWithHyphens = (text) => {
    // Replace spaces with hyphens using regular expression
    text = text.trim().toLowerCase();
    return text.replace(/\s+/g, "-");
  };
  let capitalizeWords = (str) => {
    return str.replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
  };

  const container = document.getElementById("prod-cat-slider");
  let addElement = (ind, category, imageURL) => {
    let link = replaceSpacesWithHyphens(category);
    category = capitalizeWords(category);
    const itemHTML = `
        <li ><button role="button" href="#" id=${link} style="border:none;">
            <div class="uk-panel uk-card-default col-div" >
            <div class="img-div">
                <img id=${link} class="lazy-image" src="../../img/icon/placeholder.png" alt="${category}" data-src="${imageURL}" width="400" height="600" alt="">
                
                </div>
                <div class="uk-card-body">
                    <h3 class="uk-card-title">${category}</h3>
                </div>
            </div>
            </button>
        </li>`;

    container.insertAdjacentHTML("afterbegin", itemHTML);
  };
  container.addEventListener("click", function (event) {
    console.log(
      "Button pressed",
      event,
      event.target.tagName,
      event.target.getAttribute("id")
    );
    if (event.target.tagName === "IMG") {
      const link = event.target.getAttribute("id");
      selectedCategory = link;
      console.log("Show Items of ====", link);
      handleButtonClick(link);
    }
  });
  const itemsData = JSON.parse(localStorage.getItem("category"));
  itemsData.forEach((ele, ind) => {
    console.log("Each Item ==== :", ele);
    console.log("Each Item ==== :", ele.categoryName, ele.imageUrl);

  //   // Call the function to add a fruit item
  //   // name, weight, price, imageURL
    addElement(ind, ele.categoryName, ele.imageUrl);

  //   // if(!isFirstLoad) {
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
        }, 3000);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  });

  let current_page = document.getElementById("cart");
  console.log("current_page color change", current_page);
  current_page.querySelector("i").style.color ="#61B846";
  current_page.querySelector("p").style.color = "#61B846";

  let home = document.getElementById("home");
  home.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./purchase.html";
  });

  let acc_setting = document.getElementById("acc-setting");
  acc_setting.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./account-setting.html";
  });

  const placeorder = document.getElementById("placeorder");

  // Regular expressions for validation
  // Email Regex: It should not start or end with whitespace.
  // It should have one "@" symbol in the middle.
  // It should have at least one character before and after the "@" symbol.
  // It should have at least one character after the last "." symbol.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const contactRegex = /^\d{11}$/;
  const fullnameRegex = /^[A-Za-z\s]+$/;

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

    const fullname = document.getElementById("fullname").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact").value;
    let acc_type, userAcc;
    // let acc_type = document.querySelector('input[name="acc_type"]:checked');

    console.log("fullname = ", fullname);
    console.log("address = ", address);
    console.log("email = ", email);
    // console.log("password = ", password);
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
  
    // Validate username
    if (address.trim() === "") {
      showError(document.getElementById("address"), "address is required.");
    } else {
      clearError(document.getElementById("address"));
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
      
          writeUserData(user.uid, fullname, address, email, contact, confirmorder)
            .then(() => {
              console.log("Order Placed.")
              // window.location.href = "./order.html"
            })
            .catch((error) => {
              console.error("Error writing placed order data:", error);
            });
    }
  }

  // Attach form validation function to the form's submit event
  placeorder.addEventListener("click", validateForm);

  let writeUserData = (userId, fullname, email, password, contact, confirmorder) => {
    return new Promise((resolve, reject) => {
        const userRef = ref(database, 'order/' + userId);

        set(userRef, {
            userId: userId,
            fullname: fullname,
            address: address,
            email: email,
            contact: contact,
            confirmorder: confirmorder
        })
        .then(() => {
            console.log("Order saved to Firebase Database.");
            resolve(); // Resolve the promise to indicate success
        })
        .catch((error) => {
            console.error("Error Order saving data:", error);
            reject(error); // Reject the promise with the error
        });
    });
}

} else if (
  (userAcc && userAcc.acc_type === "admin") ||
  userAcc === null ||
  userAcc === undefined
) {
  console.log("User is Auth but role is not User");
  window.location.href = "../auth/signin.html";
} else {
  console.log("Unauth User Access!");
  window.location.href = "../auth/signin.html";
}
