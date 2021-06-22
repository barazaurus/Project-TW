document.getElementById("btn").addEventListener("click", () => {
  buildPostBody();
  window.location.href = "/frontEnd/components/admin-manage/admin-manage.html";
});

function buildPostBody() {
  let prodId = parseInt(window.location.href.split("?")[1].split("=")[1]);
  let body = {};
  body.product_id = prodId;
  body.name = document.getElementById("name").value;
  body.description = document.getElementById("descriere").value.trim();
  body.price = parseFloat(document.getElementById("price").value);
  body.quantity = parseInt(document.getElementById("quantity").value);
  body.category = document.getElementById("category").value;
  fetch("http://localhost:8125/api/products", {
    method: "PUT",
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
    });
}

function loadPage() {
  let prodId = parseInt(window.location.href.split("?")[1].split("=")[1]);
  fetch("http://localhost:8125/api/products?product_id=" + prodId)
    .then((resp) => resp.json())
    .then((data) => {
      document.getElementById("name").value = data.name;
      document.getElementById("descriere").value = data.description;
      document.getElementById("price").value = data.price;
      document.getElementById("quantity").value = data.quantity;
      document.getElementById("category").value = data.category;
    });
}

loadPage();