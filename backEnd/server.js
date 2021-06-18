const http = require("http");
const path = require("path");
const fs = require("fs");
const DataHandler = require("./dataHandler").DataHandler;

function objFromQueryParam(param) {
  let obj = {};
  let comps = param.split("=");
  obj[comps[0]] = comps[1];
  return obj;
}

function extractParams(path) {
  let paramObject = {};

  let slices = path.split("/");
  let leng = slices.length;
  slices = slices[leng - 1].split("?");
  paramObject["path"] = slices[0];
  paramObject["query"] = {};
  if (slices.length > 1) {
    for (let el of slices[1].split("&")) {
      let obj = objFromQueryParam(el);
      paramObject["query"][Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
    }
  }
  return paramObject;
}

function buildBody(req) {
  let data = "";
  return new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(JSON.parse(data));
    });
  });
}

function serverHandler(request, response) {
  response.setHeader("Content-Type", "application/json");
  let dh = new DataHandler();
  let paramObj = extractParams(request.url);

  console.log(extractParams(request.url));

  if (request.method === "GET") {
    if (paramObj.path === "products") {
      if (Object.keys(paramObj.query).length > 0) {
        if (paramObj.query.product_id === undefined) {
          dh.getProductBy(paramObj.query)
            .then((data) => {
              response.writeHead(200);
              response.end(JSON.stringify(data));
            })
            .catch(() => {
              response.writeHead(404);
              response.end(JSON.stringify({ status: "Not Found!" }));
            });
        } else {
          dh.getProductById(paramObj.query.product_id)
            .then((data) => {
              response.writeHead(200);
              response.end(JSON.stringify(data));
            })
            .catch(() => {
              response.writeHead(404);
              response.end(JSON.stringify({ status: "Not Found!" }));
            });
        }
      } else {
        dh.getAll().then((data) => {
          response.end(JSON.stringify(data));
        });
      }
    } else if (paramObj.path === "users") {
    }
  } else if (request.method === "POST") {
    if (paramObj.path === "products") {
      buildBody(request).then((body) => {
        dh.addProduct(body)
          .then((data) => {
            response.writeHead(200);
            response.end(JSON.stringify({ status: "Product inserted!" }));
          })
          .catch((status) => {
            response.writeHead(400);
            response.end(JSON.stringify({ status: "Product not inserted" }));
          });
      });
    } else if (paramObj.path === "users") {
      buildBody(request).then((body) => {
        dh.registerUser(body)
          .then((data) => {
              response.writeHead(200);
              response.end(JSON.stringify(data));
          })
          .catch((status) => {
            if (status === 402) {
              response.writeHead(402);
              response.end(JSON.stringify({ status: "Email already used!" }));
            } else {
              response.writeHead(400);
              response.end(JSON.stringify({ status: "Registration failed!" }));
            }
          });
      });
    }else if(paramObj.path === "login"){
        buildBody(request).then((body)=>{
            dh.getUserByCredentials(body.email,body.password).then(data => {
                response.writeHead(200);
                response.end(JSON.stringify(data));
            }).catch((status)=>{
                response.writeHead(404);
                response.end(JSON.stringify({status:'User not found!'}));
            });
        });
    }
  } else if (request.method === "PUT") {
      buildBody(request).then((body)=>{
          dh.updateProduct(body).then(data => {
              response.writeHead(200);
              response.end(JSON.stringify({status:'Product updated!'}));
          }).catch((status)=>{
              response.writeHead(404);
              response.end(JSON.stringify({status:'Product not found!'}));
          });
      });
  }
}

http.createServer(serverHandler).listen(8125);