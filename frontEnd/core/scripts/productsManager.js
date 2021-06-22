const DELETE_PRODUCT_URL = "http://localhost:8125/api/products";
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
  removeBtn.textContent = "remove";
  removeBtn.className = "btn-remove";
  let editBtn = document.createElement("button");
  editBtn.textContent = "edit";
  removeBtn.className = "btn-edit";
  removeBtn.classList.add("manage-btn");
  editBtn.classList.add("manage-btn");
  editBtn.style.marginBottom = "30px";
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
  editBtn.addEventListener("click",()=>{
    window.location.href = "../../components/admin-edit/admin-edit.html?id=" + productObject.product_id;
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

var addNewProductButton = document.getElementById('new-product--btn');
addNewProductButton.addEventListener('click', () => {
  window.location.href = "/frontEnd/components/admin-page/admin.html";
});