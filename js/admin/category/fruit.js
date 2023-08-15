import { isAuth } from "../../auth/auth.js";
import firebaseExports from "../../config/firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
    let itemsData;
    console.log("Admin-Home: Fruit Page");

    document.getElementById("Top").style.display = "block";
    // Use the Firebase Configuration functions
    const {
        database,
        ref,
        get,
        storage,
        storageRef,
        getDownloadURL,
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
    
    // Create a function to generate and add a fruit item to the container
    let addFruitItem = (inde, category, name, weight, price, imageURL) => {
        const container = document.getElementById("content-category");

        const innerDiv = document.createElement("div");
        innerDiv.classList.add(`cat-${inde}`);

        const button = document.createElement("button");
        button.classList.add("col-12", "btn", "btn-get-started", "cat-inp");

        const fruitTitleDiv = document.createElement("div");
        fruitTitleDiv.classList.add("fruit-title");

        // getImg(category , name)
        //     .then(imageUrl => {
        //         if (imageUrl) {
        //             // Create an <img> element and set its src attribute to the imageUrl
        //             const imgElement = document.createElement("img");
        //             imgElement.src = imageUrl;
        //             imgElement.alt = name;

        //             // Append the <img> element to a container in your HTML
        //             const container = document.getElementById("image-container");
        //             container.appendChild(imgElement);
        //         }
        //     })
        //     .catch(error => {
        //         console.error("Error:", error);
        //     });

        // const img = document.createElement("img");
        // img.src = imageURL;
        // img.alt = name;

        const imgElement = document.createElement("img");
        imgElement.src = imageURL;
        imgElement.alt = name;

        const nameDiv = document.createElement("div");

        const nameParagraph = document.createElement("p");
        nameParagraph.id = name;
        nameParagraph.textContent = name;

        const weightParagraph = document.createElement("p");
        weightParagraph.id = name + "-weight";
        weightParagraph.textContent = "Per" + weight;

        const priceParagraph = document.createElement("p");
        priceParagraph.id = name + "-price";
        priceParagraph.textContent = price;

        // Append elements in the correct hierarchy
        console.log("container ==== ",container);
        container.appendChild(innerDiv);
        innerDiv.appendChild(button);
        button.appendChild(fruitTitleDiv);
        fruitTitleDiv.appendChild(imgElement);
        fruitTitleDiv.appendChild(nameDiv);
        nameDiv.appendChild(nameParagraph);
        nameDiv.appendChild(weightParagraph);
        button.appendChild(priceParagraph);
    }

    let getAllItemData = async () => {
        try {
            const snapshot = await get(ref(database, `items/fruit/`));
            // Data snapshot contains the data at the specified location
            itemsData = snapshot.val();
            return itemsData;
        } catch (error) {
            console.error("Error getting data:", error);
            return false;
        }
    }

    getAllItemData()
        .then((data) => {
            if (!data) {
                console.log("Data is null")
            } else {
                console.log('Retrieved data:', data);
                const itemsArray = Object.values(data);
                console.log('updated into Array ====:', itemsArray);
                
                itemsArray.forEach((ele, ind) => {
                    console.log('Each Item ==== :', ele);
                    console.log('Each Item ==== :', ele.itemCategory, ele.itemName, ele.unitName, ele.unitPrice, ele.imageUrl);
                    
                    // Call the function to add a fruit item
                    // name, weight, price, imageURL
                    addFruitItem(ind, ele.itemCategory, ele.itemName, ele.unitName, ele.unitPrice, ele.imageUrl);
                });
            }
            // Process the retrieved data

        })
        .catch((error) => {
            console.error('Error fetching Items Data:', error);
        });
} else if (
    (userAcc && userAcc.acc_type === "user") ||
    userAcc === null ||
    userAcc === undefined
) {
    console.log("User is Auth but role is not Admin");
    window.location.href = "../auth/signin.html";
} else {
    console.log("Unauth User Access!");
    window.location.href = "../auth/signin.html";
}
});