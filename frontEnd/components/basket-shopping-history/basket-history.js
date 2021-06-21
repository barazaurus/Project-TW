var items = [];
var historyCardCount = 1;
var itemFromBasket = {
  name: 'Manusi',
  price: 17.99,
  quantity: 3,
};

function createBasketCard() {
  let basketCardDiv = document.createElement("div");
  basketCardDiv.className = "basket-history";

  let headerFlexItem = document.createElement("div");
  headerFlexItem.className = "basket-history--flex";
  let headerTitleSpan = document.createElement('span');
  headerTitleSpan.innerHTML = `Basket Shopping #${historyCardCount++}`;
  headerTitleSpan.id = "header-title";
  headerFlexItem.appendChild(headerTitleSpan);

  let categoryFlexItem = document.createElement("div");
  categoryFlexItem.className = "basket-history--flex";
  let categoryNameSpan = document.createElement('span');
  let categoryPriceSpan = document.createElement('span');
  let categoryQtSpan = document.createElement('span');
  categoryNameSpan.innerHTML = 'Name';
  categoryNameSpan.className = 'category-span';
  categoryPriceSpan.innerHTML = 'Price';
  categoryPriceSpan.className = 'category-span';
  categoryQtSpan.innerHTML = 'Qt'
  categoryQtSpan.className = 'category-span';
  categoryFlexItem.appendChild(categoryNameSpan);
  categoryFlexItem.appendChild(categoryPriceSpan);
  categoryFlexItem.appendChild(categoryQtSpan);

  let productsFlexItem = document.createElement("div");
  productsFlexItem.className = "basket-history--flex";
  let productName = document.createElement('span');
  let productPrice = document.createElement('span');
  let productQt = document.createElement('span');
  productName.innerHTML = itemFromBasket.name;
  productPrice.innerHTML = itemFromBasket.price;
  productQt.innerHTML = itemFromBasket.quantity;
  productsFlexItem.appendChild(productName);
  productsFlexItem.appendChild(productPrice);
  productsFlexItem.appendChild(productQt);

  basketCardDiv.appendChild(headerFlexItem);
  basketCardDiv.appendChild(categoryFlexItem);
  basketCardDiv.appendChild(productsFlexItem);
  document.body.appendChild(basketCardDiv);
}

createBasketCard();
createBasketCard();
createBasketCard();
createBasketCard();
createBasketCard();
createBasketCard();
createBasketCard();
createBasketCard();
createBasketCard();
createBasketCard();
createBasketCard();
createBasketCard();
createBasketCard();
createBasketCard();