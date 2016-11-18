$(document).ready(function(){
  console.log('yisss!!!')
  
  /////// Variables to obtain elements from the DOM ///////
  
  var userNameInput = $('#inputName');
  var userEmailInput = $('#inputEmail');
  var userPasswordInput = $('#inputPassword');
  var signUpButton = $('#signUpBtn');
  var signInButton = $('.signInBtn');
  var signinEmail = $('#signinEmailInput');
  var signinPassword = $('#signinPasswordInput')
  // var logoutButton = $(".logoutBtn")
  
  ////// Requests ///////
  
  var onSignUp = function (username, password){
    username = userNameInput.val();
    password = userPasswordInput.val();
    var newUser = {'username':username, 'password': password};
    console.log('this is the new user', newUser)
    var ajax = $.ajax('/signup', {
        type: 'POST',
        data: JSON.stringify(newUser),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res){
      console.log("this is the response", res)
    });
  };
  
  var onSignIn = function (username, password){
    username = signinEmail.val();
    password = signinPassword.val();
    var existingUser = {'username': username, 'password':password};

    var ajax = $.ajax('/login', {
        type: 'POST',
        data: JSON.stringify(existingUser),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(function(res){
      console.log("this is the response", res.success)
      if(res.success){
        window.location.href = "/user-home/" + username
      }
      else{
        console.log("error")
      }
    });
  }
  
  
  
  ////// Event Listeners ///////
  
  signUpButton.click(function(event){
    event.preventDefault();
    onSignUp();
    userNameInput.val('');
    userEmailInput.val('');
    userPasswordInput.val('');
  });
  
  signInButton.click(function(event){
    event.preventDefault();
    onSignIn();
    signinPassword.val('');
    signinEmail.val('');
  })
  
  // logoutButton.click(function(event){
  //     event.preventDefault();
  //     console.log('this is doing something')
  //     onLogout();
  // })
  




})


