let product = {
    name: "test",
    description: "test",
    price: 3.47,
    image: "",
    category: "Beekeeper",
    quantity: 3,
    visits: 5,
  };
  
  function createProduct(productObject) {
    let productImage = document.createElement("img");
    console.log(productObject.image);
    productImage.src = '../../../' + productObject.image;
    productImage.style.width = '300px';
    productImage.style.height = '250px';
  
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
    productBuyButton.addEventListener("click", openBasketShopping);
  
    let product = document.createElement("div");
      product.className = "top-rated--product";
    product.appendChild(productImage);
    product.appendChild(productTitlePrice);
    product.appendChild(productBuyButton);
  
    document.querySelector(".products").appendChild(product);
  }
  
  function openBasketShopping() {
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
      removeProductFromBasket(basketBodyItem);
    });
    basketBodyItemName.innerHTML = product.name;
    basketBodyItemPrice.innerHTML = product.price;
    basketBodyItemQuantity.type = "number";
    basketBodyItemQuantity.value = 1;
    basketBodyItemRemove.innerHTML = "Remove";
    basketBodyItem.appendChild(basketBodyItemNameDiv);
    basketBodyItem.appendChild(basketBodyItemPriceDiv);
    basketBodyItem.appendChild(basketBodyItemQuantityDiv);
    basketBodyItem.appendChild(basketBodyItemRemove);
    basketBody.appendChild(basketBodyItem);
  
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
  
  fetch('').then(resp => resp.json()).then(products => {
      for(let product of products){
          createProduct(product);
      }
  });
