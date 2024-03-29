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

function writeImage(blob, path) {
  let regex = /^data:.+\/(.+);base64,(.*)$/;
  let matches = blob.match(regex);
  let ext = matches[1];
  let data = matches[2];
  let buffer = Buffer.from(data, "base64");
  fs.writeFileSync(path, buffer);
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
  let dh = new DataHandler();
  response.setHeader("Content-Type", "application/json");
  let paramObj = extractParams(request.url);
  console.log(request.method);
  console.log(paramObj);

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "POST,GET,PUT,DELETE,PATCH"
  );
  if (request.method === "OPTIONS") {
    console.log("OPTIONS");
    response.writeHead(200);
    response.end(JSON.stringify({}));
  }
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
    } else if (paramObj.path === "login") {
      dh.checkUserIfLoggedIn(paramObj.query.token)
        .then((data) => {
          response.writeHead(200);
          response.end(JSON.stringify(data));
        })
        .catch((status) => {
          response.writeHead(404);
          response.end(JSON.stringify({ status: "Not Ok" }));
        });
    } else if (paramObj.path === "commands") {
      dh.getCommandHistory(paramObj.query.token)
        .then((data) => {
          response.writeHead(200);
          response.end(JSON.stringify(data));
        })
        .catch((status) => {
          response.writeHead(404);
          response.end(JSON.stringify({ status: "Not Ok" }));
        });
    } else if (paramObj.path === "visits") {
      dh.getMostVisitedProducts()
        .then((data) => {
          response.writeHead(200);
          response.end(JSON.stringify(data));
        })
        .catch((status) => {
          response.writeHead(404);
          response.end(JSON.stringify({ status: "Not Found" }));
        });
    } else if (paramObj.path === "bids") {
      dh.getAllBids()
        .then((data) => {
          response.writeHead(200);
          response.end(JSON.stringify(data));
        })
        .catch((status) => {
          response.writeHead(404);
          response.end(JSON.stringify({ status: "No bids" }));
        });
    } else if (paramObj.path === "bestBid") {
      dh.getBestBid()
        .then((data) => {
          response.writeHead(200);
          response.end(JSON.stringify(data));
        })
        .catch((status) => {
          response.writeHead(404);
          response.end(JSON.stringify({ status: "No best bid!" }));
        });
    } else if (paramObj.path === "auctionProduct") {
      dh.getBidProduct()
        .then((data) => {
          response.writeHead(200);
          response.end(JSON.stringify(data));
        })
        .catch((status) => {
          response.writeHead(404);
          response.end(JSON.stringify({ status: "No auction product!" }));
        });
    }  else if (paramObj.path === "csv") {
      dh.getCommandsAsCSV()
      .then((data)=>{
        console.log(data);
        response.writeHead(200);
        response.end(JSON.stringify(data));
      }).catch((status)=>{
        response.writeHead(404);
        response.end(JSON.stringify({status:"No data"}));
      });
    } else if (paramObj.path === "txt") {
      dh.getAllCommands()
        .then((data) => {
          response.writeHead(200);
          response.end(JSON.stringify(data));
        })
        .catch((status) => {
          response.writeHead(404);
          response.end(JSON.stringify({ status: "NO history!" }));
        });
      }
  } else if (request.method === "POST") {
    if (paramObj.path === "products") {
      buildBody(request).then((body) => {
        let path = "../images/" + body.name.replace(" ", "_") + ".jpeg";
        writeImage(body.image, path);
        body.image = path;
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
        body.type = 0;
        dh.registerUser(body)
          .then((data) => {
            console.log("on reject");
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
    } else if (paramObj.path === "login") {
      buildBody(request).then((body) => {
        console.log(body);
        dh.getUserByCredentials(body.email, body.password)
          .then((data) => {
            response.writeHead(200);
            response.end(JSON.stringify(data));
          })
          .catch((status) => {
            response.writeHead(404);
            response.end(JSON.stringify({ status: "User not found!" }));
          });
      });
    } else if (paramObj.path === "admin") {
      buildBody(request).then((body) => {
        body.type = 1;
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
    } else if (paramObj.path === "commands") {
      buildBody(request).then((body) => {
        dh.addCommand(body)
          .then((data) => {
            response.writeHead(200);
            response.end(JSON.stringify({ status: "Commands Inserted!" }));
          })
          .catch((status) => {
            response.writeHead(400);
            response.end(JSON.stringify({ status: "Bad request!" }));
          });
      });
    } else if (paramObj.path === "bids") {
      buildBody(request).then((body) => {
        dh.addBid(body)
          .then((data) => {
            response.writeHead(200);
            response.end(JSON.stringify({ status: "Bid placed!" }));
          })
          .catch((status) => {
            response.writeHead(400);
            response.end(
              JSON.stringify({ status: "Bid could not be placed!" })
            );
          });
      });
    } else if (paramObj.path === "startAuction") {
      buildBody(request).then((body) => {
        dh.bidProduct(body)
          .then((data) => {
            response.writeHead(200);
            response.end(JSON.stringify({ status: "Auction started!" }));
          })
          .catch((status) => {
            response.writeHead(400);
            response.end(JSON.stringify({ status: "Auction not started!" }));
          });
      });
    }
  } else if (request.method === "PATCH") {
    if (paramObj.path === "visits") {
      buildBody(request).then((body) => {
        dh.updateVisits(body)
          .then((status) => {
            response.writeHead(200);
            response.end(JSON.stringify({ status: "Updated!" }));
          })
          .catch((status) => {
            response.writeHead(404);
            response.end(
              JSON.stringify({ status: "Not updated due to error!" })
            );
          });
      });
    } else {
      buildBody(request).then((body) => {
        dh.updateProduct(body)
          .then((data) => {
            response.writeHead(200);
            response.end(JSON.stringify({ status: "Product updated!" }));
          })
          .catch((status) => {
            response.writeHead(404);
            response.end(JSON.stringify({ status: "Product not found!" }));
          });
      });
    }
  } else if (request.method === "PUT") {
    if (paramObj.path === "products") {
      buildBody(request).then((body) => {
        dh.updateProductData(body)
          .then((status) => {
            response.writeHead(200);
            response.end(JSON.stringify({ status: "Product updated!" }));
          })
          .catch((status) => {
            response.writeHead(400);
            response.end(JSON.stringify({ status: "Product not updated!" }));
          });
      });
    }
  } else if (request.method === "DELETE") {
    console.log("sunt pe delete");
    console.log(paramObj);
    if (paramObj.path === "products") {
      buildBody(request).then((body) => {
        dh.deleteProduct(body)
          .then((status) => {
            response.writeHead(200);
            response.end(JSON.stringify({ status: "Product deleted!" }));
          })
          .catch((status) => {
            response.writeHead(400);
            response.end(
              JSON.stringify({ status: "Product not found or bad request!" })
            );
          });
      });
    } else if (paramObj.path === "bids") {
      dh.clearBids()
        .then((data) => {
          response.writeHead(200);
          response.end(JSON.stringify({ status: "Bids deleted" }));
        })
        .catch((status) => {
          response.writeHead(400);
          response.end(
            JSON.stringify({ status: "Bids could not be deleted!" })
          );
        });
    } else if (paramObj.path === "clearAuction") {
      console.log("am ajuns");
      dh.clearBidProduct()
        .then((data) => {
          response.writeHead(200);
          response.end(JSON.stringify({ status: "Bid product cleared!" }));
        })
        .catch((status) => {
          response.writeHead(400);
          response.end(
            JSON.stringify({ status: "Auction not cleared, bad request!" })
          );
        });
    }
  }
}

http.createServer(serverHandler).listen(8125);