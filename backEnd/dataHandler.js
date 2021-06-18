const sqlite = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");

class DataHandler {
  constructor() {
    this.db = new sqlite.Database(
      "../dataBase/bahopa.db",
      (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log("Database connected!");
      }
    );
  }

  //utils
  buildProduct(object) {
    let productArr = [];
    productArr.push(object["name"]);
    productArr.push(object["description"]);
    productArr.push(object["price"]);
    productArr.push(object["image"]);
    productArr.push(object["quantity"]);
    productArr.push(object["category"]);
    productArr.push(object["visits"]);
    return productArr;
  }

  buildUser(object) {
    let userArr = [];
    userArr.push(object["email"]);
    userArr.push(object["username"]);
    userArr.push(object["password"]);
    userArr.push(object["type"]);
    return userArr;
  }

  constructSqlCommand(searchObject) {
    let baseSql = "select * from products where ";
    let parameters = [];
    let numOfKeys = 0;
    for (let key in searchObject) {
      if (numOfKeys > 0) {
        baseSql += " and " + key + "=?";
      } else {
        baseSql += key + "=?";
      }
      parameters.push(searchObject[key]);
      numOfKeys++;
    }
    return [baseSql, parameters];
  }

  generateToken(email) {
    let jwtToken = jwt.sign({ email: email }, "secret", {
      expiresIn: "3600s",
    });
    return jwtToken;
  }

  //queries
  getAll() {
    let sql = "select * from products";
    return new Promise((resolve, reject) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(404);
        }
        resolve(rows);
      });
    });
  }

  getProductBy(searchObject) {
    let sql = "select *  from products where ";
    return new Promise((resolve, reject) => {
      let [sql, parameters] = this.constructSqlCommand(searchObject);
      this.db.all(sql, parameters, (err, rows) => {
        if (err) {
          reject(404);
        }
        resolve(rows);
      });
    });
  }

  getProductById(product_id) {
    let sql = "select * from products where product_id = ?";
    return new Promise((resolve, reject) => {
      this.db.get(sql, [product_id], (err, row) => {
        if (err) {
          reject(404);
        }
        resolve(row);
      });
    });
  }

  getUserByCredentials(email, password) {
    let sql = "select * from users where email = ? and password = ?";
    return new Promise((resolve, reject) => {
      this.db.get(sql, [email, password], (err, row) => {
        if (row === undefined) {
          reject(404);
        }
        resolve({
            email:email,
            username:row.username,
            type:row.type,
            token:this.generateToken({ email: email })
        });
      });
    });
  }

  checkUserIfLoggedIn(token) {
    let sql = "select * from users where email = ?";
    return new Promise((reject, resolve) => {
      if (
        jwt.verify(token, "secret", (err, obj) => {
          if (row === undefined) {
            reject({ status: 403 });
          }
          this.db.get(sql, [obj.email], (err, row) => {
            if (row === undefined) {
              reject({ status: 404 });
            }
            resolve(row);
          });
        })
      );
    });
  }

  userAlreadyExist(user) {
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM users WHERE email = ?";
      this.db.get(sql, [user.email], function (err, row) {
        if (err) {
          reject(false);
        }
        if (row === undefined) {
          reject(false);
        }
        resolve(true);
      });
    });
  }

  //inserts
  addProduct(product) {
    let sqlcmd =
      "INSERT INTO products(name,description,price,image,quantity,category,visits) VALUES(?,?,?,?,?,?,?)";
    return new Promise((resolve, reject) => {
      this.db.run(sqlcmd, this.buildProduct(product), function (err) {
        if (err) {
          reject(400);
        }
        resolve(200);
      });
    });
  }

  registerUser(user) {
    let sqlcmd = "INSERT INTO users(email,username,password) VALUES(?,?,?)";
    let superThis = this;
    return new Promise((reject, resolve) => {
      superThis
        .userAlreadyExist(user)
        .then((status) => {
          reject(402);
        })
        .catch((status) => {
          this.db.run(sqlcmd, this.buildUser(user), function (err) {
            if (err) {
              reject(400);
            }
            resolve(user);
          });
        });
    });
  }

  updateProduct(updateObject) {
    let sql = "UPDATE products SET quantity = ? WHERE product_id = ?";
    return new Promise((resolve, reject) => {
      this.db.run(
        sql,
        [updateObject.quantity, updateObject.product_id],
        function (err) {
          if (err) {
            reject(400);
          }
          resolve(200);
        }
      );
    });
  }
}

module.exports.DataHandler = DataHandler;