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
