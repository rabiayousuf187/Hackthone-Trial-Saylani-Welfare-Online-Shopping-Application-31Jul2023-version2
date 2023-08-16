import { isAuth } from "../../auth/auth.js";
import firebaseExports from "../../config/firebase-config.js";

// document.addEventListener("DOMContentLoaded", () => {
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
  let itemsData;
  console.log("Admin-Home: Fruit Page");

  window.addEventListener("load", function () {
    console.log("Page Completely Loaded");
    // Perform actions here that you want to execute after the page is fully loaded,
    // including lazy-loaded images

    document.getElementById("Top").style.visible = "visible";
    const { database, ref, get } = firebaseExports;

    let current_page = document.getElementById("home");
    console.log("current_page color change", current_page);
    current_page.querySelector("img").style.filter =
      "invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)";
    current_page.querySelector("p").style.color = "#61B846";
    current_page.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default link behavior
      window.location.href = "../admin.html";
    });

    let add_item = document.getElementById("add-item");
    add_item.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default link behavior
      window.location.href = "../add-item.html";
    });

    let acc_setting = document.getElementById("acc-setting");
    acc_setting.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default link behavior
      window.location.href = "../account-setting.html";
    });

    let order = document.getElementById("order");
    order.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default link behavior
      window.location.href = "../order.html";
    });
 
    const showElement = (elementId, display = "block") => {
        document.getElementById(elementId).style.display = display;
      };

    const hideElement = (elementId) => {
        document.getElementById(elementId).style.display = "none";
      };

    let checkAllImagesLoaded = (detail1, detail2, detail3) => {
      showElement(detail1);
      showElement(detail2);
      showElement(detail3);
    };
    // Create a function to generate and add a fruit item to the container
    // Assuming you have a container element with id "content-category"
    const container = document.getElementById("content-category");

    let addFruitItem = (ind, category, name, weight, price, imageURL) => {
      const itemHTML = `
        <div id="cat-${category}-${ind}" class="cat-${category}">
            <button class="col-12 btn btn-get-started cat-inp">
                <div class="sub-cat-title">
                    <img class="lazy-image" data-src="${imageURL}" src="placeholder.jpg" alt="${name}" />
                    <div id="sub-cat-details-${ind}" class="sub-cat-details" style="display: none;">
                        <p class="sub-cat-name">${name}</p>
                        <p class="sub-cat-weight">Per ${weight}</p>
                    </div>
                </div>
                <p id="sub-cat-price-${ind}" class="sub-cat-price" style="display: none;">$ ${price}</p>
            </button>
        </div>
    `;

      container.insertAdjacentHTML("beforeend", itemHTML);
    };

    let getAllItemData = async () => {
      try {
        const snapshot = await get(ref(database, `items/fruit/`));
        // Data snapshot contains the data at the specified location
        itemsData = snapshot.val();
        console.log("Retrieved data:", itemsData);
        itemsData = Object.values(itemsData);
        return itemsData;
      } catch (error) {
        console.error("Error getting data:", error);
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
          overflow: "hidden",
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
        console.log("entered inloading");

        document.getElementById("Top").insertAdjacentHTML(
          "afterbegin",
          `<div id='loading' class="loading" align="center">
        <div class="main">
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
      } catch (error) {
        console.error("Erorr SPinning: ==== ", error);
        return false;
      }
    };

    const loadingContainer = document.getElementById("loading-container");
    showElement('loading-container',"flex" );
    // Show loading spinner while data is being loaded
    
    console.log("Loadingggggggggggg");
    simulateDataLoading()
      .then(() => {
        console.log("Display Pageeeeeeeeeee");
        showElement("Top");
        hideElement('loading-container');
        // Hide loading spinner once data is loaded
        getAllItemData()
          .then((itemsData) => {
            if (!itemsData) {
              console.log("Data is null");
            } else {
              // Here you can continue with rendering your data or performing other tasks
              console.log("updated into Array ====:", itemsData);
              itemsData.forEach((ele, ind) => {
                console.log("Each Item ==== :", ele);
                console.log(
                  "Each Item ==== :",
                  ele.itemCategory,
                  ele.itemName,
                  ele.unitName,
                  ele.unitPrice,
                  ele.imageUrl
                );

                // Call the function to add a fruit item
                // name, weight, price, imageURL
                addFruitItem(
                  ind,
                  ele.itemCategory,
                  ele.itemName,
                  ele.unitName,
                  ele.unitPrice,
                  ele.imageUrl
                );

                const lazyImages = document.querySelectorAll(".lazy-image");
                const loadImagePromises = [];

                lazyImages.forEach((img) => {
                  const promise = new Promise((resolve) => {
                    img.addEventListener("load", () => {
                      resolve();
                    });
                    img.src = img.getAttribute("data-src");
                  });
                  checkAllImagesLoaded(
                    "sub-cat-details-" + ind,
                    "sub-cat-price-" + ind,
                    `cat-fruit-${ind}`
                  );
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
                        showElement("loading");
                    
                    }, 2000);
                    // You can execute the rest of your code that depends on the loaded images here
                    // For example, showing some content or displaying a loading spinner
                  })
                //   .then(()=>{
                    
                //   })
                  .catch((error) => {
                    console.error("An error occurred:", error);
                  });

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

  // window.addEventListener("load", function() {

  // });

  // });
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
// });
