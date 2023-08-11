
    let userInfo = localStorage.getItem("userAcc");
function isAuth(){
    if ( userInfo !== null ) {
        console.log("user Exist ==== ", userInfo);
        userInfo = JSON.parse(userInfo);
        console.log("after Parse ==== ", userInfo);
        return userInfo;
    }
    else {
        console.log("user didnot Exist ==== ", userInfo ,"redirect to SignIn Page");
        window.location.href = './signin.html';
        // return userInfo =  false;
    }
}
function logout() {
    localStorage.removeItem('userAcc');
    console.log("Logout successfully! redirected to signin");
    window.location.href = './signin.html';
}

export { isAuth, logout };