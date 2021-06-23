const DELETE_PRODUCT_URL = "http://localhost:8125/api/products";
const START_AUCTION_URL = "http://localhost:8125/api/startAuction";
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

  let product = document.createElement("div");
  product.className = "top-rated--product";
  product.appendChild(productImage);
  product.appendChild(productTitlePrice);
  let removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.className = "btn-remove";
  let editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  removeBtn.className = "btn-edit";
  let startAuctionButton = document.createElement("button");
  startAuctionButton.textContent = "Start Auction";
  startAuctionButton.className = "btn-start-auction";
  startAuctionButton.classList.add("manage-btn");
  removeBtn.classList.add("manage-btn");
  editBtn.classList.add("manage-btn");
  editBtn.style.marginBottom = "30px";
  product.appendChild(startAuctionButton);
  product.appendChild(removeBtn);
  product.appendChild(editBtn);
  removeBtn.addEventListener("click", () => {
    console.log("here");
    fetch("http://localhost:8125/api/products", {
      method: "DELETE",
      body: JSON.stringify({ product_id: productObject.product_id }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      });
    product.remove();
  });
  editBtn.addEventListener("click", () => {
    window.location.href =
      "../../components/admin-edit/admin-edit.html?id=" +
      productObject.product_id;
  });
  startAuctionButton.addEventListener("click", () => {
    startAuctionProduct(START_AUCTION_URL, {
      product_id: productObject.product_id,
    }).then((data) => {
      console.log(data);
    });
    window.location.href =
      "/frontEnd/components/auction-page/auction.html";
  });
  document.querySelector(".products").appendChild(product);
}

fetch("http://localhost:8125/api/products")
  .then((resp) => resp.json())
  .then((products) => {
    for (let product of products) {
      createProduct(product);
    }
  });

async function deleteProductFromDB(url = "", data = {}) {
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
}

async function startAuctionProduct(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

function downloadTxt(file, text, format) {
  let element = document.createElement("a");
  if (format === "json") {
    element.setAttribute(
      "href",
      "data:application/json;charset=utf-8, " + encodeURIComponent(text)
    );
  } else {
    element.setAttribute(
      "href",
      "data:csv;charset=utf-8, " + encodeURIComponent(text)
    );
  }
  element.setAttribute("download", file);

  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

var addNewProductButton = document.getElementById("new-product--btn");
addNewProductButton.addEventListener("click", () => {
  window.location.href =
    "/frontEnd/components/admin-page/admin.html";
});
var token = localStorage.getItem("userToken");
let saveCSV = document.getElementById("new-product--csv");
saveCSV.addEventListener("click", () => {
  fetch(`http://localhost:8125/be/api/stats/csv?token=${token}`)
    .then((resp) => resp.json())
    .then((data) => {
      let content = data.content;
      let fname = "stats.csv";
      downloadTxt(fname, content, "csv");
    });
});
let saveTXT = document.getElementById("new-product--txt");
saveTXT.addEventListener("click", () => {
  fetch(`http://localhost:8125/be/api/stats/txt?token=${token}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
      let content = JSON.stringify(data);
      let fname = "stats.json";
      downloadTxt(fname, content, "json");
    });
});