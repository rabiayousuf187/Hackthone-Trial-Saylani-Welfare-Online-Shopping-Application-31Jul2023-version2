import { isAuth } from "../auth/auth.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);


if (userAcc && userAcc.acc_type === 'admin') {

  // localStorage.setItem("isAdminFirstLoad", "true"); // Mark the page as loadedd
  console.log("Admin.Page");

  window.addEventListener("load", function () {

    const isFirstLoad = JSON.parse(localStorage.getItem("isAdminFirstLoad"));
    console.log("isFirstLoad ==== ", isFirstLoad)

    const showElement = (elementId, display = "block") => {
      document.getElementById(elementId).style.display = display;
    };

    const hideElement = (elementId) => {
      document.getElementById(elementId).style.display = "none";
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
      console.log("entered inloading");
      try {
        if (isFirstLoad) {
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
        } else {
          hideElement("loading-container"); // Hide the spinner container directly
          showElement("Top"); // Show the main content
        }
      } catch (error) {
        console.error("Erorr SPinning: ==== ", error);
        return false;
      }
    };

    document.getElementById("adminname").innerText = userAcc.fullname;
    let replaceSpacesWithHyphens = (text) => {
      // Replace spaces with hyphens using regular expression
      text = text.trim().toLowerCase();
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
                            <button id="${link}-btn" name="${link}" value="submit" class="btn btn-get-started cat-inp"
                                onclick="openpage('${link}' ,'${category}')">
                                <img class="lazy-image" src="../../img/icon/placeholder.png" alt="${category}" data-src="${imageURL}"/>
                                <p id="${link}">${category}</p>
                            </button>
                        </div>`;

      container.insertAdjacentHTML("afterbegin", itemHTML);
    };

    console.log("Loadingggggggggggg");
    simulateDataLoading()
      .then(() => {
        // Spinner Show  only first load
        const itemsData = JSON.parse(localStorage.getItem("category"));
          itemsData.forEach((ele, ind) => {
            console.log("Each Item ==== :", ele);
            console.log("Each Item ==== :", ele.categoryName, ele.imageUrl);
      
            // Call the function to add a fruit item
            // name, weight, price, imageURL
            addElement(
              ind,
              ele.categoryName,
              ele.imageUrl
            );
          });
          
      
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
      
        if (isFirstLoad) {
          localStorage.setItem("isAdminFirstLoad", "false"); // Mark the page as loaded
          setTimeout(() => {
            console.log("Page Completely Loaded");
            showElement("header");
            showElement("cat-section");
            showElement("footer");
            console.log("Hide Progress")
            console.log("HIDEEEEEEE ===== loader ", document.getElementById("loading-container"));
            hideElement("loading") ;  
            hideElement("loading-container") ;  

            console.log("Display Pageeeeeeeeeee");
          }, 3000);
          showElement("Top");
          
      
          
          console.log("Page Completely Loaded");
        } else {
          console.log("Show 2nd LOAD");

          hideElement("loading-container");
          showElement("header");
          showElement("cat-section");
          showElement("footer");
        }

      })
      .catch((error) => {
        console.error("Error loading data:", error);
        // loadingContainer.style.display = "none"; // Hide loading spinner in case of error
      });

    // console.log("2nd Load");
    // });


    let current_page = document.getElementById("home");
    console.log("current_page color change", current_page);
    current_page.querySelector('img').style.filter = 'invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)';
    current_page.querySelector('p').style.color = "#61B846";

    let add_item = document.getElementById("add-item");
    add_item.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default link behavior
      window.location.href = "./add-item.html"
    });


    let acc_setting = document.getElementById("acc-setting");
    acc_setting.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default link behavior
      window.location.href = "./account-setting.html"
    });


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