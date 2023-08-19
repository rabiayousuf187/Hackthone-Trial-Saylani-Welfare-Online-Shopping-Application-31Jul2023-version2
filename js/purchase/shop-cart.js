import { isAuth, logout } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "user") {
  console.log("Admin Account Setting Page");
  let userData,
    selectedCategory,
    disableItem,
    quantity = 0, total = 0;

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

  let addCart = (category, link) => {
    console.log(`Selected Category ${category}, Item ${link} saved into cart`);

    getSelectedItemData(`items/${category}/${link}/`)
      .then((itemsData) => {
        if (!itemsData) {
          console.log("Data is null");
        } else {
          // Here you can continue with rendering your data or performing other tasks

          const {
            itemName,
            itemCategory,
            itemContent,
            unitName,
            unitPrice,
            imageUrl,
          } = itemsData;

          console.log(
            "get selected Item Data ====:",
            itemName,
            itemCategory,
            itemContent,
            unitName,
            unitPrice,
            imageUrl
          );
          // console.log("get selected Item Data ====:", itemsData);

          writeItemData(
            userAcc.id,
            itemName,
            itemCategory,
            itemContent,
            unitName,
            unitPrice,
            imageUrl,
            `cart/${userAcc.id}/${itemName}/`
          )
            .then(() => {
              count();
              document
                .getElementById(`cat-${category}-${link}`)
                .classList.add("disable");
              document
                .getElementById(`cat-${category}-${link}`)
                .setAttribute("disabled", true);
            })
            .catch((error) => {
              console.error("Error Adding Item data:", error);
            });
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
        // showElement("sub-cat-details-" + ind);
        // showElement("sub-cat-price-" + ind);
        // showElement(`cat-fruit-${ind}`);
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

  let current_page = document.getElementById("home");
  console.log("current_page color change", current_page);
  current_page.querySelector("img").style.filter =
    "invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)";
  current_page.querySelector("p").style.color = "#61B846";

  let add_item = document.getElementById("add-item");
  add_item.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./add-item.html";
  });

  let acc_setting = document.getElementById("acc-setting");
  acc_setting.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./account-setting.html";
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
