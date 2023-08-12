let userInfo = localStorage.getItem("userAcc");

userInfo === null ? userInfo === null : userInfo = JSON.parse(userInfo);
function isAuth() {
  if (userInfo !== null ) {
    console.log("user Exist ==== ", userInfo);
    console.log("after Parse ==== ", userInfo);
    return userInfo;
  } else {
    console.log("user didnot Exist ==== ", userInfo, "redirect to SignIn Page");
    window.location.href = "../auth/signin.html";
    // return userInfo =  false;
  }
}
function logout() {
  localStorage.removeItem("userAcc");
  console.log("Logout successfully! redirected to signin");
  window.location.href = "../auth/signin.html";
}

export { isAuth, logout };
