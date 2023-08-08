let current_page  = document.getElementById("add-item");
console.log("current_page color change", current_page);
current_page.querySelector('i').style.color = "#61B846";
current_page.querySelector('p').style.color = "#61B846";

let home  = document.getElementById("home");
home.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./sale-product.html"
});

let acc_setting  = document.getElementById("acc-setting");
acc_setting.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./account-setting.html"
});