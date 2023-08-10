function isAuth(redirect, pagename){
    localStorage.getItem('userAcc');
    if(userAcc!==null){
        console.log(`Auth successfully! redirected to page ${pagename}`);
        window.location.href = redirect;    
    }
    else{
        console.log(`UnAuth User! redirected to Signin Page`);
        window.location.href = './auth/signin.html';    
        // return true;
    }
}

function logout(){
    localStorage.removeItem('userAcc');
    console.log("Logout successfully! redirected to signin");
    window.location.href = './signin.html';    
}