let products = [];
let product = {
  name: "test",
  description: "test",
  price: 3.47,
  image: "",
  category: "Beekeeper",
  quantity: 3,
  visits: 5,
};
let shoppingCart = [];

function createProduct(productObject) {
  let productImage = document.createElement("img");
  console.log(productObject.image);
  productImage.src = "../../../" + productObject.image;
  productImage.style.width = "300px";
  productImage.style.height = "250px";

  let productTitlePrice = document.createElement("div");
  productTitlePrice.className = "product-body";
  let productTitle = document.createElement("h2");
  productTitle.innerHTML = productObject.name;
  let productPrice = document.createElement("span");
  productPrice.innerHTML = productObject.price;
  productTitlePrice.appendChild(productTitle);
  productTitlePrice.appendChild(productPrice);

  let productBuyButton = document.createElement("button");
  productBuyButton.className = "btn-buy";
  productBuyButton.innerHTML = `BUY <i class="fa fa-shopping-cart"></i>`;
  productBuyButton.addEventListener("click", () => {
    openBasketShopping(productObject);
  });

  let product = document.createElement("div");
  product.className = "top-rated--product";
  product.appendChild(productImage);
  product.appendChild(productTitlePrice);
  product.appendChild(productBuyButton);

  document.querySelector(".products").appendChild(product);
  return product;
}

function openBasketShopping(productObject) {
  //command_id,email,product_name,product_quantity,product_price
  let tempObject = {
    email: "lili@gmail.com",
    product_name: productObject.name,
    product_quantity: 1,
    product_price: productObject.price,
  };
  let foundEl = false;
  for (let i = 0; i < shoppingCart.length; i++) {
    if (shoppingCart[i].product_name === tempObject.product_name) {
      shoppingCart[i].product_quantity += tempObject.product_quantity;
      foundEl = true;
      break;
    }
  }
  if (foundEl === false) {
    shoppingCart.push(tempObject);
  }
  let opacityBackground = document.createElement("div");
  opacityBackground.className = "opacityBackGround";

  let basketPopUp = document.createElement("div");
  basketPopUp.className = "basketPopUp";

  let basketHeader = document.createElement("div");
  basketHeader.className = "basket--flex-item";
  let basketHeaderTitle = document.createElement("span");
  basketHeaderTitle.innerHTML = "Basket Shopping";
  basketHeaderTitle.id = "basketPopUp--title";
  basketHeader.appendChild(basketHeaderTitle);

  let basketBody = document.createElement("div");
  basketBody.className = "basket--flex-item";

  //begin
  for (let i = 0; i < shoppingCart.length; i++) {
    let basketBodyItem = document.createElement("div");
    basketBodyItem.className = "basket-item--content";
    let basketBodyItemNameDiv = document.createElement("div");
    let basketBodyItemNameTitle = document.createElement("span");
    let basketBodyItemName = document.createElement("span");
    basketBodyItemNameDiv.className = "item-content--flex";
    basketBodyItemNameTitle.innerHTML = "Name";
    basketBodyItemNameTitle.id = "item-name--title";
    basketBodyItemNameDiv.appendChild(basketBodyItemNameTitle);
    basketBodyItemNameDiv.appendChild(basketBodyItemName);

    let basketBodyItemPriceDiv = document.createElement("div");
    let basketBodyItemPriceTitle = document.createElement("span");
    let basketBodyItemPrice = document.createElement("span");
    basketBodyItemPriceDiv.className = "item-content--flex";
    basketBodyItemPriceTitle.id = "item-price--title";
    basketBodyItemPriceTitle.innerHTML = "Price";
    basketBodyItemPriceDiv.appendChild(basketBodyItemPriceTitle);
    basketBodyItemPriceDiv.appendChild(basketBodyItemPrice);

    let basketBodyItemQuantityDiv = document.createElement("div");
    let basketBodyItemQuantityTitle = document.createElement("span");
    let basketBodyItemQuantity = document.createElement("input");
    basketBodyItemQuantityDiv.className = "item-content--flex";
    basketBodyItemQuantity.id = "item-quantity--input";
    basketBodyItemQuantityDiv.appendChild(basketBodyItemQuantityTitle);
    basketBodyItemQuantityDiv.appendChild(basketBodyItemQuantity);

    let basketBodyItemRemove = document.createElement("button");
    basketBodyItemRemove.id = "item-button--remove";
    basketBodyItemRemove.addEventListener("click", () => {
      console.log(localStorage.getItem("userEmail"));
      console.log(localStorage.getItem("userToken"));
      shoppingCart.splice(i, 1);
      removeProductFromBasket(basketBodyItem);
    });
    basketBodyItemName.innerHTML = shoppingCart[i].product_name;
    basketBodyItemPrice.innerHTML = shoppingCart[i].product_price;
    basketBodyItemQuantity.type = "number";
    basketBodyItemQuantity.value = shoppingCart[i].product_quantity;
    basketBodyItemQuantity.addEventListener("change", (e) => {
      shoppingCart[i].product_quantity = parseInt(e.target.value);
    });
    basketBodyItemRemove.innerHTML = "Remove";
    basketBodyItem.appendChild(basketBodyItemNameDiv);
    basketBodyItem.appendChild(basketBodyItemPriceDiv);
    basketBodyItem.appendChild(basketBodyItemQuantityDiv);
    basketBodyItem.appendChild(basketBodyItemRemove);
    basketBody.appendChild(basketBodyItem);
  }
  //ending

  let basketFooter = document.createElement("div");
  basketFooter.className = "basket--flex-item";
  let continueShoppingButton = document.createElement("button");
  continueShoppingButton.className = "btn-continueShopping";
  continueShoppingButton.innerHTML = "Continue Shopping";
  continueShoppingButton.addEventListener("click", () => {
    closeBasket(opacityBackground);
  });
  let checkoutButton = document.createElement("button");
  checkoutButton.className = "btn-checkout";
  checkoutButton.innerHTML = "Checkout";
  checkoutButton.addEventListener("click", (e) => {
    fetch('http://localhost:8125/api/commands',{
      method:'POST',
      body:JSON.stringify(shoppingCart)
    }).then(data => {
      console.log(data);
      shoppingCart = [];
    })
  });
  basketFooter.appendChild(continueShoppingButton);
  basketFooter.appendChild(checkoutButton);

  basketPopUp.appendChild(basketHeader);
  basketPopUp.appendChild(basketBody);
  basketPopUp.appendChild(basketFooter);

  opacityBackground.appendChild(basketPopUp);
  document.body.appendChild(opacityBackground);
}

function removeProductFromBasket(event) {
  event.remove();
}

function closeBasket(event) {
  event.remove();
}

fetch("http://localhost:8125/api/products")
  .then((resp) => resp.json())
  .then((productsArray) => {
    for (let product of productsArray) {
      products.push(createProduct(product));
    }
  });

let selectedValue = document.querySelector("ul");
selectedValue.addEventListener("click", selectListItem);

function selectListItem(e) {
  console.log(e.target.innerHTML.toLowerCase());
  let selectedCategory = e.target.innerHTML.toLowerCase();
  for (let prod of products) {
    prod.remove();
  }
  products = [];
  fetch(`http://localhost:8125/api/products?category=${selectedCategory}`)
    .then((resp) => resp.json())
    .then((productsArray) => {
      for (let product of productsArray) {
        products.push(createProduct(product));
      }
    });
}
