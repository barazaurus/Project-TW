const TOP_RATED_URL = "";
var topRatedProducts = [];
var topProduct = {
  image: "",
  name: "test",
  price: 3.47,
  quantity: 3,
};

function getTopRatedProducts(){
fetch("http://localhost:8125/api/visits")
  .then((resp) => resp.json())
  .then((productsArray) => {
    for (let product of productsArray) {
        console.log(product);
        topRatedProducts.push(createProduct(product));
    }
  });
}
getTopRatedProducts();

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
    window.location.href = "/frontEnd/components/shop-page/shop.html";
  });

  let product = document.createElement("div");
  product.className = "top-rated--product";
  product.appendChild(productImage);
  product.appendChild(productTitlePrice);
  product.appendChild(productBuyButton);

  document.querySelector(".products").appendChild(product);
  return product;
}