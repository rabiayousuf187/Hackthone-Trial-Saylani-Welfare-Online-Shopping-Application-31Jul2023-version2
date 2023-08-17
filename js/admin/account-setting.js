import { isAuth } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "admin") {
  console.log("Admin Account Setting Page");

  document.getElementById("Top").style.display = "block";
//   document.getElementById("adminname").innerText = userAcc.fullname;
  // Use the Firebase Configuration functions
  const {
    database,
    ref,
    set,
    storage,
    storageRef,
    uploadBytes,
    getDownloadURL,
  } = firebaseExports;

  const addClickListener = (elementId, destination) => {
    const element = document.getElementById(elementId);
    element.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = destination;
    });
  };

    let current_page = document.getElementById("acc-setting");
    console.log("current_page color change", current_page);
    current_page.querySelector('img').style.filter = 'invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)';
    current_page.querySelector('p').style.color = "#61B846";

    addClickListener('home' , './admin.html');
    addClickListener('add-item' , './add-item.html');

    
    var logoutbtn = document.getElementById('logout');

    logoutbtn.addEventListener('click', function () {
        console.log("Logout");
        setTimeout( ()=>{
            logout();
        } , 1000);
    });
}
