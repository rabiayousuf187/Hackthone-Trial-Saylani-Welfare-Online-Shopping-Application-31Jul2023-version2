import { isAuth } from "../../auth/auth.js";
import firebaseExports from "../../config/firebase-config.js";
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
let  getImg = async (itemCategory , itemName ) => {
    try {
        const imageUrl = await storageRef(storage,`images/${itemCategory}/${itemName}`
          ).getDownloadURL();
        return imageUrl;
    } catch (error) {
        console.error("Error getting image from storage:", error);
        return null;
    }

}
// Create a function to generate and add a fruit item to the container
let addFruitItem = (name, weight, price, imageURL) => {
    const container = document.getElementById("fruit-container");

    const div = document.createElement("div");
    div.classList.add("cat-1");

    const button = document.createElement("button");
    button.classList.add("col-12", "btn", "btn-get-started", "cat-inp");

    const fruitTitleDiv = document.createElement("div");
    fruitTitleDiv.classList.add("fruit-title");

    const img = document.createElement("img");
    img.src = imageURL;
    img.alt = name;

    const nameDiv = document.createElement("div");

    const nameParagraph = document.createElement("p");
    nameParagraph.id = "fruit-name";
    nameParagraph.textContent = name;

    const weightParagraph = document.createElement("p");
    weightParagraph.id = "fruit-weight";
    weightParagraph.textContent = weight;

    const priceParagraph = document.createElement("p");
    priceParagraph.id = "fruit-price";
    priceParagraph.textContent = price;

    // Append elements in the correct hierarchy
    container.appendChild(div);
    div.appendChild(button);
    button.appendChild(fruitTitleDiv);
    fruitTitleDiv.appendChild(img);
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
                data.map((ele) => {
                    
                    // Call the function to add a fruit item
                    // name, weight, price, imageURL
                    addFruitItem(ele.itemName,ele.unitName,ele.unitPrice,ele.imageUrl);

                });
            }
            // Process the retrieved data

        })
        .catch((error) => {
            console.error('Error fetching data:', error);
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
