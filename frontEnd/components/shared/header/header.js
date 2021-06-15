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
      margin-right: 40px;
      cursor: pointer;
    }
   .flex-spacer{
      flex: 1 1 auto;
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

customElements.define("header-component", Header);
