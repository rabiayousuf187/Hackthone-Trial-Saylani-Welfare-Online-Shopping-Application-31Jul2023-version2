function isAuth(redirect){
    localStorage.getItem('userAcc');
    if(userAcc!==null){
        window.location.href = redirect;
    }
    else{
        window.location.href = './signin.html';    
    }
}

function logout(){
    localStorage.removeItem('userAcc');
    console.log("Logout successfully! redirected to signin");
    window.location.href = './signin.html';    
}