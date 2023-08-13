import { isAuth } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
    console.log("Add Item Page");

    document.getElementById("Top").style.display = "block";
      // Use the Firebase Configuration functions
  const { auth, createUserWithEmailAndPassword, database, ref, set } =
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
