import { isAuth, logout } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "user") {
  console.log("Order Page");

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
  window.addEventListener("load", () => {
    getAllItemData(`order/${userAcc.id}/`)
      .then((order) => {
        const { fullname,address,email,contact, itemData} = itemsData;
        // console.log(`GET CART DATA ==`, cartData);
        // disableItem = Object.keys(cartData);

        const order = document.querySelector(".order-row");
        
        const quantity = 1;
        
        userData.forEach((ele, ind) => {
                     
            showItem(
            container,
            ind,
            fullname,address,email,contact,status = pending
            );
            ele.itemData.forEach((ele, ind) => {
                const itemHTML = `
                <div class="order-row">
                    <div class="cust-name">
                        <h4>${fullname}</h4>
                    </div>
                    <div class="order-cust-status">
                        <span id="status-time" class="status-time-status">Just Now - pending</span>
                        <span id="cust-contact" class="cust-contact">${contact}</span>
                    </div>
                    <div class="order-item">
                        <p id="order-list-item" class="order-list-item">${quantity} x ${ele.itemData.quantity}</p>
                    </div>
                    <div class="order-price">
                        <span style="color: black;">Total</span>
                        <span id="total-price" class="total-price">PKR. 185.00</span>
                    </div>
                    
                </div>`;
            });

            
        //   console.log(`${ele.itemName} not found in the array.`);
        });
        container.insertAdjacentHTML("beforeend", order);
       
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

let current_page  = document.getElementById("order");
console.log("current_page color change", current_page);
current_page.querySelector('img').style.filter = 'invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)';
current_page.querySelector('img').style.background = '#2b75142b';
current_page.querySelector('img').style.borderRadius = '4px';

let home  = document.getElementById("home");
home.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./sale-product.html"
});

let add_item  = document.getElementById("add-item");
add_item.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./add-item.html"
});

let acc_setting  = document.getElementById("acc-setting");
acc_setting.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./account-setting.html"
});

// get data from dropdown
    // var dropdownItems = document.querySelectorAll('.dropdown-item');
    
    // dropdownItems.forEach(function(item) {
    //     item.addEventListener('click', function(event) {
    //         event.preventDefault(); // Prevent the link from navigating
            
    //         var selectedValue = item.textContent.trim();
    //         console.log('Selected category:', selectedValue);
            
    //         // You can perform additional actions with the selectedValue here
    //     });
    // });

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
  