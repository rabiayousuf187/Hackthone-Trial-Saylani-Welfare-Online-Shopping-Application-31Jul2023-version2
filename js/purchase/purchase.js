import { isAuth } from "../auth/auth.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);


if (userAcc && userAcc.acc_type === 'user') {
    
    // localStorage.setItem("isAdminFirstLoad", "true"); // Mark the page as loadedd
    console.log("User Purchase.Page");
    document.getElementById('Top').style.display = 'block';
  document.getElementById("adminname").innerText = userAcc.fullname;
    
    const showElement = (elementId, display = "block") => {
        document.getElementById(elementId).style.display = display;
      };
    
    // Check if the page has been loaded before
    // const isFirstLoad = JSON.parse(localStorage.getItem("isAdminFirstLoad"));
    

  let replaceSpacesWithHyphens = (text) => {
    // Replace spaces with hyphens using regular expression
    text=text.trim(text);
    return text.replace(/\s+/g, '-');
  }
    const container = document.getElementById("content-category");
    let addElement = (
        ind,
        category,
        imageURL,
      ) => {

        let link = replaceSpacesWithHyphens(category);
        const itemHTML = `
        <div class="cat-${ind} cat-style">
                            <button id="${link}-btn" name="${category}" value="submit" class="btn btn-get-started cat-inp"
                                onclick="openpage('./category/${link}.html', '${category} Page')">
                                <img class="lazy-image" src="../../img/icon/placeholder.png" alt="${category}" data-src="${imageURL}"/>
                                <p id="${link}">${category}</p>
                            </button>
                        </div>`;
  
        container.insertAdjacentHTML("afterbegin", itemHTML);
      };
      const itemsData = JSON.parse(localStorage.getItem("category"));
    itemsData.forEach((ele, ind) => {
        console.log("Each Item ==== :", ele);
        console.log( "Each Item ==== :",ele.categoryName,ele.imageUrl);

        // Call the function to add a fruit item
        // name, weight, price, imageURL
        addElement(
          ind,
          ele.categoryName,
          ele.imageUrl
        );

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