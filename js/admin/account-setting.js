import { isAuth, logout } from "../auth/auth.js";

import firebaseExports from "../config/firebase-config.js";

const { auth, signInWithEmailAndPassword, database, ref, get } = firebaseExports;
// //Only For Auth User: Config and Initialize Firebase
// if (firebaseExports !== null) {
//     // Use the Firebase functions
//     // Now you can use these imported functions
//     // ...
// } else {
//     console.log("User Already Logged In, didnot required Firebase");
//     // window.location.href = './signin.html';
// }

let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === 'admin') {
    console.log("Account Setting Page");

    let current_page = document.getElementById("acc-setting");
    console.log("current_page color change", current_page);
    current_page.querySelector('img').style.filter = 'invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)';
    current_page.querySelector('p').style.color = "#61B846";

    let home = document.getElementById("home");
    home.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = "./sale-product.html"
    });

    let add_item = document.getElementById("add-item");
    add_item.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = "./add-item.html"
    });

    var logoutbtn = document.getElementById('logout');

    logoutbtn.addEventListener('click', function () {
        console.log("Logout");
        setTimeout( ()=>{
            logout();
        } , 3000);
    });
}
