import { isAuth, logout } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "user") {
  console.log("Admin Account Setting Page");

  let userData;
  document.getElementById("Top").style.display = "block";
    // document.getElementById("adminname").innerText = userAcc.fullname;
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

  let current_page = document.getElementById("acc-setting");
  console.log("current_page color change", current_page);
  current_page.querySelector("img").style.filter =
    "invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)";
  current_page.querySelector("p").style.color = "#61B846";

  addClickListener('home' , "./purchase.html" );
  addClickListener('cart' , "./shop-cart.html" );


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

  const showElement = (elementId, display = "block") => {
    document.getElementById(elementId).style.display = display;
  };

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
                
                window.location.href = "../purchase/purchase.html";
            
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
    <div class="order-row">
        <div class="cust-name">
            <h4>Inzamam Malik</h4>
        </div>
        <div class="order-cust-status">
            <span id="status-time" class="status-time-status">Just Now - Pending</span>
            <span id="cust-contact" class="cust-contact">03022004480</span>
        </div>
        <div class="order-item">
            <p id="order-list-item" class="order-list-item">2 x ITEM NAME</p>
            <p id="order-list-item" class="order-list-item">3 x ITEM NAME</p>
        </div>
        <div class="order-price">
            <span style="color: black;">Total</span>
            <span id="total-price" class="total-price">$ 185.00</span>
        </div>
        <div class="row justify-content-center">
            <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="btn-group">
                    <button class="btn btn-secondary dropdown-toggle" type="button"
                        data-bs-toggle="dropdown" data-bs-auto-close="true"
                        aria-expanded="false" id="order-updated-status">
                        Change Status
                    </button>
                    <ul class="dropdown-menu" id="order-status-category">
                        <li><a class="dropdown-item" href="#">Reject</a></li>
                        <li><a class="dropdown-item" href="#">Pending</a></li>
                        <li><a class="dropdown-item" href="#">Processing</a></li>
                        <li><a class="dropdown-item" href="#">Shipped</a></li>
                        <li><a class="dropdown-item" href="#">Delivered</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`;

    container.insertAdjacentHTML("beforeend", itemHTML);
  };
  // window.addEventListener("load", () => {
  //   getAllItemData(`order/${userAcc.id}/`)
  //     .then((order) => {
  //       const { fullname,address,email,contact, itemData} = itemsData;
  //       // console.log(`GET CART DATA ==`, cartData);
  //       // disableItem = Object.keys(cartData);

  //       const order = document.querySelector(".order-row");
        
  //       const quantity = 1;
        
  //       userData.forEach((ele, ind) => {
                     
  //           showItem(
  //           container,
  //           ind,
  //           fullname,address,email,contact,status = pending
  //           );
  //           ele.itemData.forEach((ele, ind) => {
  //               const itemHTML = `
  //               <div class="order-row">
  //                   <div class="cust-name">
  //                       <h4>${fullname}</h4>
  //                   </div>
  //                   <div class="order-cust-status">
  //                       <span id="status-time" class="status-time-status">Just Now - pending</span>
  //                       <span id="cust-contact" class="cust-contact">${contact}</span>
  //                   </div>
  //                   <div class="order-item">
  //                       <p id="order-list-item" class="order-list-item">${quantity} x ${ele.itemData.quantity}</p>
  //                   </div>
  //                   <div class="order-price">
  //                       <span style="color: black;">Total</span>
  //                       <span id="total-price" class="total-price">PKR. 185.00</span>
  //                   </div>
                    
  //               </div>`;
  //           });

            
  //       //   console.log(`${ele.itemName} not found in the array.`);
  //       });
  //       container.insertAdjacentHTML("beforeend", order);
       
  //     })

  //     .catch((error) => {
  //       console.error("Error Getting Cart Items Data:", error);
  //     });
  // });
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


    var logoutbtn = document.getElementById("logout");

  logoutbtn.addEventListener("click", function () {
    console.log("Logout");
    setTimeout(() => {
      logout();
    }, 1000);
  });
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
  