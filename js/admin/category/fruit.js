import { isAuth } from "../../auth/auth.js";
import firebaseExports from "../../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
    console.log("Admin-Home: Fruit Page");

    document.getElementById("Top").style.display = "block";
    // Use the Firebase Configuration functions
    const {
        auth,
        createUserWithEmailAndPassword,
        database,
        ref,
        set,
        storage,
        storageRef,
        uploadBytes,
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

    let getAllItemData = () => {
        return new Promise((resolve, reject) => {
            // get reference to the Firebase Realtime Database
            // get data to the database
            set(ref(database, `items/fruit/`), {
              itemName: itemname,
              itemCategory: selectedCategory,
              itemContent: itemcontent,
              unitName: unitname,
              unitPrice: unitprice,
              imageUrl: downloadURL, // Store the image URL here
            })
            dataRef.once('value')
        .then((snapshot) => {
            // snapshot contains the data
            const data = snapshot.val();

            // Process the data as needed
            console.log('Retrieved data:', data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });

              .then(() => {
                console.log("Data saved to Firebase Database. with Img");
                resolve(); // Resolve the promise to indicate success
              })
              .catch((error) => {
                console.error("Error saving data:", error);
                reject(error); // Reject the promise with the error
              });
          });
    }

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
