const headerTemplate = document.createElement("template");

headerTemplate.innerHTML = `
  <style>
    img {
        witdh: 30px;
        height: 30px;
    }
    nav {
      height: 60px;
      padding: 0 10px;
      list-style: none;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      background-color:  #0a0a23;
      position: fixed;
      width: 100%;
    }
    
    ul {
      padding-inline-start: 0;
    }
    ul li {
      list-style: none;
      display: inline;
    }
    
    a {
      font-weight: 700;
      margin: 0 25px;
      color: #fff;
      text-decoration: none;
    }
    
    a:hover {
      padding-bottom: 5px;
      box-shadow: inset 0 -2px 0 0 #fff;
    }
    .fa-user-alt{
      color: white;
      cursor: pointer;
      margin-right: 10px;
    }
    .fa-user-alt:hover{
      opacity: 0.7;
    }
   .flex-spacer{
      flex: 1 1 auto;
    }
    #logout-btn{
      text-decoration: none;
      background: transparent;
      outline: 0;
      border: 0;
      cursor: pointer;
      margin-right: 20px;
    }
    #logout-img{
      height: 20px;
      width: 30px;
    }
    #logout-btn:hover{
      opacity: 0.7;
    }
    
  </style>
  <head>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
      integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
      crossorigin="anonymous"
    />
  </head>
  <header>
  <nav>
      <ul>
      <li><a href="/frontEnd/components/home-page/home.html">Home</a></li>
      <li><a href="/frontEnd/components/shop-page/shop.html">Shop</a></li>
      <li><a href="/frontEnd/components/auction-page/auction.html">Auction</a></li>
      </ul>
      <span class="flex-spacer"></span>
      <i class="fas fa-user-alt"></i>
      <button id="logout-btn">
        <img id="logout-img" src="../../assets/images/logout-icon.svg" />
      </button>
  </nav>
  </header>
  
`;

class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.appendChild(headerTemplate.content);
  }
}

let logoutBtn = headerTemplate.content.querySelector("#logout-btn");
logoutBtn.addEventListener("click", () => {
  window.location.href = "/frontEnd/app.html";
});

let userTypeButton = headerTemplate.content.querySelector(".fa-user-alt");
let userTypeLocalStorage = localStorage.getItem("userType");
userTypeButton.addEventListener("click", () => {
  console.log(userTypeLocalStorage);
  if (userTypeLocalStorage == 0) {
    window.location.href = "/frontEnd/components/basket-shopping-history/basket-history.html";
  } else {
    window.location.href = "/frontEnd/components/admin-page/admin.html";
  }
});

customElements.define("header-component", Header);