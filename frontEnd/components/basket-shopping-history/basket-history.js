const BASKET_ROUTE = "";
var token = localStorage.getItem("userToken");
var historyCardCount = 1;
var itemFromBasket = {
  name: "Manusi",
  price: 17.99,
  quantity: 3,
};

function getBasketsFromDB() {
  console.log(token);
  fetch(`http://localhost:8125/api/commands?token=${token}`)
    .then((resp) => resp.json())
    .then((productsArray) => {
      for (let product in productsArray) {
        console.log(productsArray[product]);
        createBasketCard(productsArray[product]);
      }
    });
}
getBasketsFromDB();

function createBasketCard(basketShopObject) {
  let basketCardDiv = document.createElement("div");
  basketCardDiv.className = "basket-history";

  let headerFlexItem = document.createElement("div");
  headerFlexItem.className = "basket-history--flex";
  let headerTitleSpan = document.createElement("span");
  headerTitleSpan.innerHTML = `Basket Shopping #${historyCardCount++}`;
  headerTitleSpan.id = "header-title";
  headerFlexItem.appendChild(headerTitleSpan);

  let categoryFlexItem = document.createElement("div");
  categoryFlexItem.className = "basket-history--flex";
  let categoryNameSpan = document.createElement("span");
  let categoryPriceSpan = document.createElement("span");
  let categoryQtSpan = document.createElement("span");
  categoryNameSpan.innerHTML = "Name";
  categoryNameSpan.className = "category-span";
  categoryPriceSpan.innerHTML = "Price";
  categoryPriceSpan.className = "category-span";
  categoryQtSpan.innerHTML = "Qt";
  categoryQtSpan.className = "category-span";
  categoryFlexItem.appendChild(categoryNameSpan);
  categoryFlexItem.appendChild(categoryPriceSpan);
  categoryFlexItem.appendChild(categoryQtSpan);

  basketCardDiv.appendChild(headerFlexItem);
  basketCardDiv.appendChild(categoryFlexItem);
  for (let index = 0; index < basketShopObject.length; ++index) {
    let productsFlexItem = document.createElement("div");
    productsFlexItem.className = "basket-history--flex";
    let productName = document.createElement("span");
    let productPrice = document.createElement("span");
    let productQt = document.createElement("span");
    productName.innerHTML = basketShopObject[index].product_name;
    productPrice.innerHTML = basketShopObject[index].product_price;
    productQt.innerHTML = basketShopObject[index].product_quantity;
    productsFlexItem.appendChild(productName);
    productsFlexItem.appendChild(productPrice);
    productsFlexItem.appendChild(productQt);

    basketCardDiv.appendChild(productsFlexItem);
  }
  document.body.appendChild(basketCardDiv);
}