import { isAuth} from "../auth/auth.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === 'admin') {
    console.log("Admin Setting Page");
    document.getElementById('Top').style.display = 'block';
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
else if ( (userAcc && userAcc.acc_type === 'user') || userAcc === null || userAcc === undefined) {
    console.log("User is Auth but role is not Admin");
    window.location.href = '../auth/signin.html';
}
else{
    console.log("Unauth User Access!");
    window.location.href = '../auth/signin.html';
}