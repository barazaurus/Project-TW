const REGISTER_URL = "http://localhost:8125/api/users";
const LOGIN_URL = "http://localhost:8125/api/login";
const CHECK_LOGIN_URL = "http://localhost:8125/api/login/get";

var isFormValid = false;

var userLoginCredentials = {
  email: "",
  password: "",
};

var userRegisterCredentialsFromInput = {
  email: "",
  password: "",
  confirmPassword: "",
};

var userRegisterCredentials = {
  email: "",
  username: "",
  password: "",
};

var userAfterLogin = {
  email: "",
  username: "",
  password: "",
  token: "",
};

var userLoginEmail = document.getElementById("login--email-field");
var userLoginPassword = document.getElementById("login--password-field");
var loginButton = document.getElementById("login-btn");
var userRegisterEmail = document.getElementById("register--email-field");
var userRegisterPassword = document.getElementById("register--password-field");
var userRegisterConfirmPassword = document.getElementById(
  "register--confirmPassword-field"
);
var signUpButton = document.getElementById("register--signup-btn");
var emailError = document.getElementById("err-email");
var passwordError = document.getElementById("err-password");
var loginError = document.getElementById("err-login");

function getLoginValuesFromInput() {
  this.userLoginCredentials.email = userLoginEmail.value;
  this.userLoginCredentials.password = userLoginPassword.value;
}

function getRegisterValuesFromInput() {
  this.userRegisterCredentialsFromInput.email = userRegisterEmail.value;
  this.userRegisterCredentialsFromInput.password = userRegisterPassword.value;
  this.userRegisterCredentialsFromInput.confirmPassword =
    userRegisterConfirmPassword.value;
}

function parseRegisterValuesFromInput() {
  this.userRegisterCredentials.email = this.userRegisterCredentialsFromInput.email;
  this.userRegisterCredentials.username = this.userRegisterCredentialsFromInput.email.split(
    "@"
  )[0];
  this.userRegisterCredentials.password = this.userRegisterCredentialsFromInput.password;
}

function checkIsEmailValid() {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(userRegisterEmail.value).toLowerCase())) {
    emailError.style.color = "red";
    return false;
  } else {
    emailError.style.color = "white";
    return true;
  }
}

function checkMatchingPasswords() {
  if (userRegisterPassword.value !== userRegisterConfirmPassword.value) {
    userRegisterPassword.value = "";
    userRegisterConfirmPassword.value = "";
    passwordError.style.color = "red";
    return false;
  } else {
    passwordError.style.color = "white";
    return true;
  }
}

function checkFieldIsNotNull() {
  if (userRegisterEmail.value === null || userRegisterEmail.value === undefined)
    return false;
  if (
    userRegisterPassword.value === null ||
    userRegisterPassword.value === undefined
  )
    return false;
  if (
    userRegisterConfirmPassword.value === null ||
    userRegisterConfirmPassword.value === undefined
  )
    return false;

  return true;
}

function checkLoginFieldsAreNotNull() {
  if (userLoginEmail.value === null || userLoginEmail.value === undefined)
    return false;
  if (userLoginPassword.value === null || userLoginPassword.value === undefined)
    return false;

  return true;
}

function checkIsFormValid() {
  if (!checkFieldIsNotNull()) return false;
  if (!checkIsEmailValid()) return false;
  if (!checkMatchingPasswords()) return false;

  return true;
}

async function postUserLoginCredentials(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (response.status == "404") {
    this.loginError.style.color = "red";
  } else {
    this.loginError.style.color = "white";

    window.location.href = "./components/home-page/home.html";
  }
  return response.json();
}

async function postUserRegisterCredentials(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

async function checkUserCredentials(url = "", data = {}) {
  const response = await fetch(url, {
    method: "GET",
    body: JSON.stringify(data),
  });
  return response.json();
}

function registerUser() {
  signUpButton.addEventListener("click", () => {
    getRegisterValuesFromInput();
    parseRegisterValuesFromInput();
    if (checkIsFormValid()) {
      postUserRegisterCredentials(
        REGISTER_URL,
        this.userRegisterCredentials
      ).then((data) => {
        console.log(data);
      });
    }
  });
}

function checkCredentialsExistsInDB() {
  getLoginValuesFromInput();
  checkUserCredentials(CHECK_LOGIN_URL, this.userLoginCredentials).then(() => {
    return true;
  });
}

function loginUser() {
  loginButton.addEventListener("click", () => {
    getLoginValuesFromInput();
    if (checkLoginFieldsAreNotNull()) {
      postUserLoginCredentials(LOGIN_URL, this.userLoginCredentials).then(
        (user) => {
          this.userAfterLogin.email = user.email;
          this.userAfterLogin.username = user.username;
          this.userAfterLogin.password = user.password;
          this.userAfterLogin.token = user.token;
        }
      );
    }
  });
}

loginUser();
registerUser();