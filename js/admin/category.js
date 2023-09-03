import { isAuth } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";

let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
  let itemsData, getCategory = localStorage.getItem("category");  
  console.log("Admin-Home: Fruit Page");
  getCategory === null || getCategory === undefined ? getCategory = "fruit" : getCategory = getCategory;
  console.log("getCategory ==== ", getCategory);

  window.addEventListener("load", function () {
    console.log("Page Completely Loaded");
    // Perform actions here that you want to execute after the page is fully loaded,
    // including lazy-loaded images

    // Check if the page has been loaded before
    const isFirstLoad = JSON.parse(localStorage.getItem("isFruitFirstLoad"));
    document.getElementById("Top").style.visible = "visible";
    document.getElementById("adminname").innerText = userAcc.fullname;
    const { database, ref, get } = firebaseExports;

    const showElement = (elementId, display = "block") => {
      document.getElementById(elementId).style.display = display;
    };

    const hideElement = (elementId) => { 
      document.getElementById(elementId).style.display = "none";
    };

    const addClickListener = (elementId, destination) => {
      const element = document.getElementById(elementId);
      element.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = destination;
      });
    };

    let current_page = document.getElementById("home");
    console.log("current_page color change", current_page);
    current_page.querySelector("img").style.filter =
      "invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)";
    current_page.querySelector("p").style.color = "#61B846";
    current_page.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default link behavior
      window.location.href = "../admin.html";
    });

    // Page Links
    addClickListener("add-item", "./add-item.html");
    addClickListener("acc-setting", "./account-setting.html");
    addClickListener("order", "./order.html");

    // Create a function to generate and add a fruit item to the container
    // Assuming you have a container element with id "content-category"
    const container = document.getElementById("content-category");

    let addFruitItem = (
      ind,
      category,
      name,
      weight,
      price,
      imageURL,
      description
    ) => {
      const itemHTML = `
        <div id="cat-${category}-${ind}" class="cat-${category}">
            <button class="col-12 btn btn-get-started cat-inp"  data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop-${ind}" aria-controls="offcanvasTop-${ind}">
                <div class="sub-cat-title">
                    <img class="lazy-image" data-src="${imageURL}" src="../../../img/icon/placeholder.png" alt="${name}" />
                    <div id="sub-cat-details-${ind}" class="sub-cat-details" style="display: none;">
                        <p class="sub-cat-name">${name}</p>
                        <p class="sub-cat-weight">Per ${weight}</p>
                    </div>
                </div>
                <p id="sub-cat-price-${ind}" class="sub-cat-price" style="display: none;">$ ${price}</p>
            </button>
            <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop-${ind}" aria-labelledby="offcanvasTopLabel-${ind}">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasTopLabel-${ind}">${name}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
            ${description}
            </div>
            </div>
            </div>`;

      container.insertAdjacentHTML("beforeend", itemHTML);
    };

    let getAllItemData = async () => {
      try {
        const snapshot = await get(ref(database, `items/${getCategory}/`));
        // Data snapshot contains the data at the specified location
        itemsData = snapshot.val();
        console.log("Retrieved data:", itemsData);
        itemsData = Object.values(itemsData);
        return itemsData;
      } catch (error) {
        console.error("Error getting data:", error);
        this.document.getElementById('Top').innerHTML = `<div class="alert alert-danger" role="alert">Item Not Founds<a href="./admin.html" class="alert-link">Goto admin</a>.</div>`
        return false;
      }
    };

    function ShowProgress() {
      setTimeout(function () {
        console.log("Show Progress");
        var loading = $(".loading");
        loading.show();
        $("#overlay").css({
          display: "block",
          opacity: 0.7,
          width: $(document).width(),
          height: $(document).height(),
        });
        $("body").css({
          overflow: "auto",
        });
        $("#loading")
          .css({
            display: "block",
          })
          .click(function () {
            $(this).css("display", "none");
            $("#screen").css("display", "none");
          });
      }, 100);
      $("#main").dialog({
        modal: true,
      });
    }
    // Simulate data loading
    const simulateDataLoading = async () => {
      try {
        if (!isFirstLoad) {
        console.log("entered inloading");

        document.getElementById("Top").insertAdjacentHTML(
          "afterbegin",
          `<div id='loading' class="loading" align="center">
        <div class="main">
        <div class="small1 logo-loading">
            <div class="main-page-content">
            <h1 class="text-center mb-3 main-heading">SAYLANI WELFARE</h1>
            <!-- Heading 2 -->
            <h2 class="text-center main-sub-heading">ONLINE MARKET PLACE</h2>
        </div>
            </div>
            <div class="small1">
              <div class="small ball smallball1"></div>
              <div class="small ball smallball2"></div>
              <div class="small ball smallball3"></div>
              <div class="small ball smallball4"></div>
            </div>
    
            <div class="small2">
              <div class="small ball smallball5"></div>
              <div class="small ball smallball6"></div>
              <div class="small ball smallball7"></div>
              <div class="small ball smallball8"></div>
            </div>
    
            <div class="bigcon">
              <div class="big ball"></div>
            </div>
        </div>
    </div> `
        );
        ShowProgress();
      }else{
        hideElement("loading-container"); // Hide the spinner container directly
        showElement("Top"); // Show the main content
      }
      } catch (error) {
        console.error("Erorr SPinning: ==== ", error);
        return false;
      }
    };

    // const loadingContainer = document.getElementById("loading-container");
    showElement("loading-container", "flex");
    // Show loading spinner while data is being loaded

    console.log("Loadingggggggggggg");
    simulateDataLoading()
      .then(() => {
        // Spinner Show  only first load
        localStorage.setItem("isFruitFirstLoad", "true"); // Mark the page as loaded
        console.log("Display Pageeeeeeeeeee");
        showElement("Top");

        getAllItemData()
          .then((itemsData) => {
            if (!itemsData) {
              console.log("Data is null");
              document.getElementById
              '<div class="alert alert-primary" role="alert">"Item Not Found"</div>'
            } else {
              // Here you can continue with rendering your data or performing other tasks
              console.log("updated into Array ====:", itemsData);
              itemsData.forEach((ele, ind) => {
                console.log("Each Item ==== :", ele);
                console.log( "Each Item ==== :",ele.itemCategory,ele.itemName,ele.unitName,ele.unitPrice,ele.imageUrl);

                // Call the function to add a fruit item
                // name, weight, price, imageURL
                addFruitItem(
                  ind,
                  ele.itemCategory,
                  ele.itemName,
                  ele.unitName,
                  ele.unitPrice,
                  ele.imageUrl,
                  ele.itemContent
                );

                if(!isFirstLoad) {  
                  const lazyImages = document.querySelectorAll(".lazy-image");
                  const loadImagePromises = [];
                lazyImages.forEach((img) => {
                  const promise = new Promise((resolve) => {
                    img.addEventListener("load", () => {
                      resolve();
                    });
                    img.src = img.getAttribute("data-src");
                    showElement("sub-cat-details-" + ind);
                    showElement("sub-cat-price-" + ind);
                    showElement(`cat-fruit-${ind}`);
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
                      console.log("Hide Progress")
                      console.log("HIDEEEEEEE ===== loader ", document.getElementById("loading-container"));
                      hideElement("loading") ;  
                      hideElement("loading-container") ;  
                      // Conditionally show or hide the spinner based on isFirstLoad flag
                      // isFirstLoad === "true" ? showElement("loading-container") :                
                    }, 3000);
                    // console.log("HIDEEEEEEE ===== loader ", document.getElementById("loading-container"));
                    // hideElement("loading") ;  
                    // hideElement("loading-container") ;  
                    
                  })
                  .catch((error) => {
                    console.error("An error occurred:", error);
                  });
                }else{
                  console.log("Show 2nd LOAD");
                  
                  hideElement("loading-container");
                  const lazyImages = document.querySelectorAll(".lazy-image");
                  // const loadImagePromises = [];
                lazyImages.forEach((img) => {
                  // const promise = new Promise((resolve) => {
                    // img.addEventListener("load", () => {
                    //   // resolve();
                    // });
                    img.src = img.getAttribute("data-src");
                    showElement("sub-cat-details-" + ind);
                    showElement("sub-cat-price-" + ind);
                    showElement(`cat-fruit-${ind}`);
                  });

                      showElement("header");
                      showElement("cat-section");
                      showElement("footer");
                }

              });
            }
            // Process the retrieved data
          })

          .catch((error) => {
            console.error("Error fetching Items Data:", error);
          });
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        // loadingContainer.style.display = "none"; // Hide loading spinner in case of error
      });

    // console.log("2nd Load");
  });

} else if (
  (userAcc && userAcc.acc_type === "user") ||
  userAcc === null ||
  userAcc === undefined
) {
  console.log("User is Auth but role is not Admin");
  window.location.href = "../../auth/signin.html";
} else {
  console.log("Unauth User Access!");
  window.location.href = "../../auth/signin.html";
}
