$(document).ready(function(){

  /////// Variables to obtain elements from the DOM ///////
  var userNameInput = $('#inputName');
  var userEmailInput = $('#inputEmail');
  var userPasswordInput = $('#inputPassword');
  var signUpButton = $('#signUpBtn');
  var signInButton = $('.signInBtn');
  var signinEmail = $('#signinEmailInput');
  var signinPassword = $('#signinPasswordInput');
  var accountStatus = $('#accountStatus');
  var accountError = $('#accountError')
  var firstDivIntroToFoodtrack = $('#firstDivIntroToFoodtrack');
  var learnMoreButton = $('#learnMoreButton');
  var demoAccountButton = $('#demoAccountBtn')

  ////// Requests ///////
  var onSignUp = function (username, password){
    username = userNameInput.val();
    password = userPasswordInput.val();
    var newUser = {'username': username, 'password': password};
    var ajax = $.ajax('/signup', {
      type: 'POST',
      data: JSON.stringify(newUser),
      dataType: 'json',
      contentType: 'application/json'
    });
    ajax.done(function(res){
        if(res.error){
          accountStatus.empty();
          accountError.text('Account already exists. Please sign in or choose another username.');
        }
        else{
          accountError.empty();
          accountStatus.text('Your account was successfully created, please sign in.');
        }
    });
  };

  var onSignIn = function (username, password){
    username = signinEmail.val();
    password = signinPassword.val();
    var existingUser = {'username': username, 'password': password};

    var ajax = $.ajax('/login', {
      type: 'POST',
      data: JSON.stringify(existingUser),
      dataType: 'json',
      contentType: 'application/json'
    });
    ajax.done(function(res){
      if(res.message){
        window.location.href = "/user-home"
      }
      else{
        console.log("error signing in")
      }
    });
  };

  var onDemo = function (username, password){
    username = 'demo';
    password = 'demo';
    var demoAccountUser = {'username': username, 'password': password};

    var ajax = $.ajax('/login', {
      type: 'POST',
      data: JSON.stringify(demoAccountUser),
      dataType: 'json',
      contentType: 'application/json'
    });
    ajax.done(function(res){
      if(res.message){
        window.location.href = "/user-home"
      }
      else{
        console.log("error signing in")
      }
    });
  };

  ////// Event Listeners ///////

  // Using jQuery's animate() method to add smooth page scroll
  // With 2000 milliseconds it takes to scroll to the specified area
  learnMoreButton.click(function(event){
    event.preventDefault();
    if (this.hash !== "") { // hash is an #id on the page.
      event.preventDefault();
      var hash = this.hash;

      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 2000, function(){

        window.location.hash = hash;
      });
    }
  });

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
  });

  demoAccountButton.click(function(event){
    event.preventDefault();
    onDemo();
  });
});
