const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
const previewHref = document.querySelector('input[type="submit"]');
signupBtn.onclick = () => {
  loginForm.style.marginLeft = "-50%";
};
loginBtn.onclick = () => {
  loginForm.style.marginLeft = "0%";
};
signupLink.onclick = () => {
  signupBtn.click();
  return false;
};
previewHref.onclick = () => {
  console.log('pressed');
  window.location.href='./components/home-page/home.html';
}