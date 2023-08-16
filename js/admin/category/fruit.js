import { isAuth } from "../../auth/auth.js";
import firebaseExports from "../../config/firebase-config.js";

// document.addEventListener("DOMContentLoaded", () => {
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
    let itemsData;
    console.log("Admin-Home: Fruit Page");

    const {
        database,
        ref,
        get,
    } = firebaseExports;



    let current_page = document.getElementById("home");
    console.log("current_page color change", current_page);
    current_page.querySelector('img').style.filter = 'invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)';
    current_page.querySelector('p').style.color = "#61B846";
    current_page.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = "../admin.html"
    });

    let add_item = document.getElementById("add-item");
    add_item.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = "../add-item.html"
    });

    let acc_setting = document.getElementById("acc-setting");
    acc_setting.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = "../account-setting.html"
    });

    let order = document.getElementById("order");
    order.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = "../order.html"
    });
    // let getImg = async (itemCategory, itemName) => {
    //     try {
    //         const imageUrl = await getDownloadURL(storageRef(storage, `images/${itemCategory}/${itemName}/`));
    //         console.log("GET IMG URL _+++++ ", imageUrl)
    //         return imageUrl;
    //     } catch (error) {
    //         console.error("Error getting image from storage:", error);
    //         return null;
    //     }
    // }

    const loadImagesSequentially = async (lazyImages) => {
        for (const img of lazyImages) {
            await new Promise((resolve) => {
                img.addEventListener('load', () => {
                    resolve();
                });
                img.src = img.getAttribute('data-src');

            });
        }
    };

    // let checkAllImagesLoaded = (lazyImages, imagesLoaded, detail1, detail2) => {
    //     if (imagesLoaded === lazyImages.length) {
    //         document.getElementById(detail1).style.display = 'block';
    //         document.getElementById(detail2).style.display = 'block';

    //         // catFruitDetails.forEach(element => {
    //         //   element.style.display = 'block';
    //         //   console.log(element)
    //         // });
    //     }
    // }

    let checkAllImagesLoaded = (detail1, detail2, detail3) => {

        document.getElementById(detail1).style.display = 'block';
        document.getElementById(detail2).style.display = 'block';
        document.getElementById(detail3).style.display = 'block';

    }
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
    }
    // const innerDiv = document.createElement("div");
    // innerDiv.id = `cat-${category}-${ind}`;
    // innerDiv.classList.add(`cat-${category}`);

    // const button = document.createElement("button");
    // button.classList.add("col-12", "btn", "btn-get-started", "cat-inp");

    // const fruitTitleDiv = document.createElement("div");
    // fruitTitleDiv.classList.add("sub-cat-title");

    // const imgElement = document.createElement("img");
    // imgElement.src = "";
    // // imgElement.src = imageURL;
    // imgElement.setAttribute('data-src', imageURL);
    // imgElement.alt = name;
    // imgElement.classList.add("lazy-image");
    // // imgElement.loading = "lazy"; // Enable lazy loading

    // const nameDiv = document.createElement("div");
    // nameDiv.id = "sub-cat-details-" + ind;
    // nameDiv.classList.add("sub-cat-details");

    // const nameParagraph = document.createElement("p");
    // nameParagraph.id = name;
    // nameParagraph.classList.add("sub-cat-name");
    // nameParagraph.textContent = name;

    // const weightParagraph = document.createElement("p");
    // weightParagraph.classList.add("sub-cat-weight");
    // weightParagraph.id = "sub-cat-weight-" + ind;
    // weightParagraph.textContent = "Per" + weight;

    // const priceParagraph = document.createElement("p");
    // priceParagraph.id = "sub-cat-price-" + ind;
    // priceParagraph.classList.add("sub-cat-price");
    // priceParagraph.textContent = "$ " + price;

    // // Append elements in the correct hierarchy
    // console.log("container ==== ", container);
    // container.appendChild(innerDiv);
    // innerDiv.appendChild(button);
    // button.appendChild(fruitTitleDiv);
    // fruitTitleDiv.appendChild(imgElement);
    // fruitTitleDiv.appendChild(nameDiv);
    // nameDiv.appendChild(nameParagraph);
    // nameDiv.appendChild(weightParagraph);
    // button.appendChild(priceParagraph);

    // const lazyImages = document.querySelectorAll('.lazy-image');
    // let imagesLoaded = 0;

    // lazyImages.forEach((img) => {
    //     img.addEventListener('load', () => {
    //         imagesLoaded++;
    //         checkAllImagesLoaded(lazyImages, imagesLoaded, "sub-cat-details-" + ind, "sub-cat-price-" + ind);
    //     });
    // });

    // lazyImages.forEach((img) => {
    //     loadLazyImage(img);
    // });


let getAllItemData = async () => {
    try {
        const snapshot = await get(ref(database, `items/fruit/`));
        // Data snapshot contains the data at the specified location
        itemsData = snapshot.val();
        console.log('Retrieved data:', itemsData);
        itemsData = Object.values(itemsData);
        return itemsData;
    } catch (error) {
        console.error("Error getting data:", error);
        return false;
    }
}


getAllItemData()
    .then((itemsData) => {
        if (!itemsData) {
            console.log("Data is null")
        } else {

            console.log('updated into Array ====:', itemsData);
            itemsData.forEach((ele, ind) => {
                console.log('Each Item ==== :', ele);
                console.log('Each Item ==== :', ele.itemCategory, ele.itemName, ele.unitName, ele.unitPrice, ele.imageUrl);

                // Call the function to add a fruit item
                // name, weight, price, imageURL
                addFruitItem(ind, ele.itemCategory, ele.itemName, ele.unitName, ele.unitPrice, ele.imageUrl);


                const lazyImages = document.querySelectorAll('.lazy-image');
                loadImagesSequentially(lazyImages)
                .then(() => {
                    console.log('All images loaded sequentially.');

                    checkAllImagesLoaded("sub-cat-details-" + ind, "sub-cat-price-" + ind, `cat-fruit-${ind}`);
                    // Now, images are cached for faster loading on subsequent visits
                    // Display your text content or do other actions
                    // document.getElementById("Top").style.visibility = "visible";
                });
                
            });

            // Load images sequentially

            // setTimeout( ()=> {
            //     document.getElementById("Top").style.visibility = "visible";

            // } , 5000);

            console.log("SET TIME OUT AFter 5000");


        }
        // Process the retrieved data

    })
    .then( ()=>{
        setTimeout(()=>{
            document.getElementById("Top").style.display = "block";
        }, 3000);
    })
    .catch((error) => {
        console.error('Error fetching Items Data:', error);
    });
    // });
}else if (
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