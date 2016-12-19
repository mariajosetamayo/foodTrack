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
  var firstDivIntroToFoodtrack = $('#firstDivIntroToFoodtrack');
  var learnMoreButton = $('#learnMoreButton');

  ////// Requests ///////

  var onSignUp = function (username, password){
    username = userNameInput.val();
    password = userPasswordInput.val();
    var newUser = {'username':username, 'password': password};
    var ajax = $.ajax('/signup', {
      type: 'POST',
      data: JSON.stringify(newUser),
      dataType: 'json',
      contentType: 'application/json'
    });
    ajax.done(function(res){
      accountStatus.text('Your account was successfully created, please sign in');
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
      if(res.message){
        window.location.href = "/user-home"
      }
      else{
        console.log("error")
      }
    });
  };

  ////// Event Listeners ///////

  learnMoreButton.click(function(event){
    event.preventDefault();
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (2000) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 2000, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
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
});
