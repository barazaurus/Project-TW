const REGISTER_URL = "http://localhost:8125/api/users";
var isFormValid = false;
var userCredentialsFromInput = {
  email: "",
  password: "",
  confirmPassword: "",
};

var userCredentials = {
  email: "",
  username: "",
  password: "",
};

var userEmail = document.getElementById("register--email-field");
var userPassword = document.getElementById("register--password-field");
var userConfirmPassword = document.getElementById(
  "register--confirmPassword-field"
);
var signUpButton = document.getElementById("register--signup-btn");
var emailError = document.getElementById("err-email");
var passwordError = document.getElementById("err-password");

function getValuesFromInput() {
  this.userCredentialsFromInput.email = userEmail.value;
  this.userCredentialsFromInput.password = userPassword.value;
  this.userCredentialsFromInput.confirmPassword = userConfirmPassword.value;
}

function parseValuesFromInput() {
  this.userCredentials.email = this.userCredentialsFromInput.email;
  this.userCredentials.username = this.userCredentialsFromInput.email.split(
    "@"
  )[0];
  this.userCredentials.password = this.userCredentialsFromInput.password;
}

function checkIsEmailValid() {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(userEmail.value).toLowerCase())) {
    emailError.style.color = "red";
    return false;
  } else {
    emailError.style.color = "white";
    return true;
  }
}

function checkMatchingPasswords() {
  if (userPassword.value !== userConfirmPassword.value) {
    userPassword.value = "";
    userConfirmPassword.value = "";
    passwordError.style.color = "red";
    return false;
  } else {
    passwordError.style.color = "white";
    return true;
  }
}

function checkFieldIsNotNull() {
  if (userEmail.value === null || userEmail === undefined) return false;
  if (userEmail.password === null || userPassword === undefined) return false;
  if (userEmail.confirmPassword === null || userConfirmPassword === undefined)
    return false;

  return true;
}

function checkIsFormValid() {
  if (!checkFieldIsNotNull()) return false;
  if (!checkIsEmailValid()) return false;
  if (!checkMatchingPasswords()) return false;

  return true;
}

async function postUserCredentials(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function registerUser() {
  signUpButton.addEventListener("click", () => {
    getValuesFromInput();
    parseValuesFromInput();
    if (checkIsFormValid()) {
      postUserCredentials(REGISTER_URL, this.userCredentials).then((data) => {
        console.log(data);
      });
    } else {
      console.log("form is not ok");
    }
  });
}

registerUser();