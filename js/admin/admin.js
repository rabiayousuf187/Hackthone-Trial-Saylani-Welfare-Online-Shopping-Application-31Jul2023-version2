import { isAuth } from "../auth/auth.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);


if (userAcc && userAcc.acc_type === 'admin') {
    console.log("Admin.Page");
    document.getElementById('Top').style.display = 'block';


    let current_page = document.getElementById("home");
    console.log("current_page color change", current_page);
    current_page.querySelector('img').style.filter = 'invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)';
    current_page.querySelector('p').style.color = "#61B846";

    let add_item = document.getElementById("add-item");
    add_item.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = "./add-item.html"
    });

    let order = document.getElementById("order");
    order.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = "./order.html"
    });

    let acc_setting = document.getElementById("acc-setting");
    acc_setting.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = "./account-setting.html"
    });



}
else if ((userAcc && userAcc.acc_type === 'user') || userAcc === null || userAcc === undefined) {
    console.log("User is Auth but role is not Admin");
    window.location.href = '../auth/signin.html';
}
else {
    console.log("Unauth User Access!");
    window.location.href = '../auth/signin.html';
}