function logout(){
    Parse.User.logOut();
    document.location.href="login.html";
}