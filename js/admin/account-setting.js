let current_page  = document.getElementById("acc-setting");
console.log("current_page color change", current_page);
current_page.querySelector('img').style.filter = 'invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)';
current_page.querySelector('p').style.color = "#61B846";

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

let order  = document.getElementById("order");
order.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./order.html"
});
