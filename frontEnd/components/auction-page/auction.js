const BIDED_PRODUCT_ROUTE = "http://localhost:8125/api/auctionProduct";
const POST_BID_ROUTE = "http://localhost:8125/api/bids";
const GET_BIDS_ROUTE = "http://localhost:8125/api/bids";
const STOP_AUCTION_ROUTE = "http://localhost:8125/api/clearAuction";
const CLEAR_TABLE = "http://localhost:8125/api/bids";
const userEmail = localStorage.getItem("userEmail");
const userType = localStorage.getItem("userType");
var userInfosFromDB = [];
var tableUserBids = document.querySelector(".users-top--bids");

function getTopRatedProducts() {
  fetch(BIDED_PRODUCT_ROUTE)
    .then((resp) => {
        if(resp.status === 404){
            window.location.href = "../admin-manage/admin-manage.html";
        }
        return resp.json();
    })
    .then((productFromDB) => {
      console.log(productFromDB);
      createProduct(productFromDB);
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

  let productFooter = document.createElement("div");
  productFooter.className = "product-footer";
  if (userType == 0) {
    let productBuyButton = document.createElement("button");
    productBuyButton.className = "btn-buy";
    productBuyButton.innerHTML = `Place Bid`;

    let productInputBid = document.createElement("input");
    productInputBid.className = "input-bid";
    productInputBid.type = "text";
    productInputBid.placeholder = "Enter your bid";

    productBuyButton.addEventListener("click", () => {
      let inputBidValue = document.querySelector(".input-bid").value;
      console.log(inputBidValue);
      addBidOnProduct(POST_BID_ROUTE, {
        email: userEmail,
        bid: inputBidValue,
      });
    });

    productFooter.appendChild(productInputBid);
    productFooter.appendChild(productBuyButton);
  } else {
    let stopAuctionButton = document.createElement("button");
    stopAuctionButton.className = "btn--stopAuction";
    stopAuctionButton.innerHTML = 'Stop Auction';
    stopAuctionButton.addEventListener("click", () => {
     console.log('im here');
      fetch(STOP_AUCTION_ROUTE, { method: "DELETE" })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
            fetch(CLEAR_TABLE, { method: "DELETE" })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
            });
        });
    });
    productFooter.appendChild(stopAuctionButton);
  }

  let product = document.createElement("div");
  product.className = "top-rated--product";
  product.appendChild(productImage);
  product.appendChild(productTitlePrice);
  product.appendChild(productFooter);

  document.querySelector(".product").appendChild(product);
  return product;
}

function createUserInTable() {
  let tableContent = document.createElement("div");
  tableContent.className = "table-content";

  let tableCategoryDiv = document.createElement("div");
  tableCategoryDiv.className = "table-content--categories";
  let tableCategoryEmail = document.createElement("span");
  tableCategoryEmail.innerHTML = "Email";
  let tableCategoryBidPrice = document.createElement("span");
  tableCategoryBidPrice.innerHTML = "Bid Price";
  tableCategoryDiv.appendChild(tableCategoryEmail);
  tableCategoryDiv.appendChild(tableCategoryBidPrice);
  tableContent.appendChild(tableCategoryDiv);

  for (let row = 0; row < userInfosFromDB.length; ++row) {
    let tableRowUserInfos = document.createElement("div");
    tableRowUserInfos.className = "table-content--userRow";
    let userEmail = document.createElement("span");
    userEmail.innerHTML = userInfosFromDB[row].email;
    let userBidPrice = document.createElement("span");
    userBidPrice.innerHTML = userInfosFromDB[row].bid;
    tableRowUserInfos.appendChild(userEmail);
    tableRowUserInfos.appendChild(userBidPrice);
    tableContent.appendChild(tableRowUserInfos);
  }

  tableUserBids.appendChild(tableContent);
}

async function addBidOnProduct(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

function getInfosFromBidsDB() {
  fetch("http://localhost:8125/api/bids")
    .then((resp) => resp.json())
    .then((data) => {
      userInfosFromDB = data;
      createUserInTable();
    });
}

getInfosFromBidsDB();