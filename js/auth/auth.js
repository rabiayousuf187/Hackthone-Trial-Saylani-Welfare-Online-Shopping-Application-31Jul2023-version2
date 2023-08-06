function isAuth(redirect){
    localStorage.getItem('userAcc');
    if(userAcc!==null){
        console.log("Auth successfully! redirected to main page");
       return true;
    }
    else{
        window.location.href = redirect;    
    }
}

function logout(){
    localStorage.removeItem('userAcc');
    console.log("Logout successfully! redirected to signin");
    window.location.href = './signin.html';    
}