var currentUser= Parse.User.current();
if(currentUser){
    var userType= currentUser.get("officerClass");
    if(userType=="entry"){
        console.log(userType);
    }else{
        alert("You are not authorised to access this page");
        Parse.User.logOut();
        document.location.href="login.html";
    }
}else{
    alert("You are not logged in. Please Login to access");
    document.location.href="login.html";
}