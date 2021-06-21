const sqlite = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const uniqid = require('uniqid');

class DataHandler {
  constructor() {
    this.db = new sqlite.Database("../dataBase/bahopa.db", (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Database connected!");
    });
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

  buildCommand(object){
      let commandArr = [];
      //command_id,user_id,product_name,product_quantity,product_price
      commandArr.push(object["command_id"]);
      commandArr.push(object["user_id"]);
      commandArr.push(object["product_name"]);
      commandArr.push(object["product_quantity"]);
      commandArr.push(object["product_price"]);
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
          email: email,
          username: row.username,
          type: row.type,
          token: this.generateToken({ email: email }),
        });
      });
    });
  }

  checkUserIfLoggedIn(token) {
    let sql = "select * from users where email = ?";
    return new Promise((resolve,reject) => {
      if (
        jwt.verify(token, "secret", (err, obj) => {
          this.db.get(sql, [obj.email.email], (err,row) => {
            console.log(row);
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

  getCommandHistory(user_id){
      //to be implemented...
      let sql = "SELECT * FROM commands WHERE user_id = ?";
      let dataObj = {};
      return new Promise((resolve,reject)=>{
        this.db.all(sql,[user_id],(err,rows)=>{
          for(let i=0;i<rows.length;i++){
            if(dataObj[rows[i].command_id] === undefined){
              dataObj[rows[i].command_id] = [];
            }
            dataObj[rows[i].command_id].push(rows[i]);
          }
          resolve(dataObj);
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

  addCommand(commands){
      let sql = "INSERT INTO commands(command_id,user_id,product_name,product_quantity,product_price) VALUES(?,?,?,?,?)";
      let number = 0;
      let uid = uniqid();
      for(let i=0;i<commands.length;i++){
          commands[i]['command_id'] = uid;
          this.db.run(sql,this.buildCommand(commands[i]),(err)=>{
              number++;
              if(number === commands.length){
                  resolve(200);
              }
          });
      }
  }

  registerUser(user) {
    let sqlcmd = "INSERT INTO users(email,username,password,type) VALUES(?,?,?,?)";
    let superThis = this;
    return new Promise((resolve, reject) => {
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

  updateProductData(updateObject) {
    let sql = "UPDATE products SET ";
    let values = [];
    let num = 0;
    for (let key in updateObject) {
      if (key !== "product_id") {
        if (num > 0) {
          sql += ",";
        }
        sql += key + "=?";
        values.push(updateObject[key]);
        num++;
      }
    }
    values.push(updateObject['product_id']);
    sql += ' WHERE product_id = ?';
    return new Promise((resolve,reject)=>{
        this.db.run(sql,values,function(err){
            if(err){
                reject(400);
            }
            resolve(200);
        });
    });
  }

  //delete
  deleteProduct(searchObject) {
    let sql = "DELETE FROM products WHERE product_id = ?";
    return new Promise((resolve, reject) => {
      this.db.run(sql, [searchObject.product_id], function (err) {
        if (err) {
          reject(400);
        }
        resolve(200);
      });
    });
  }
}

module.exports.DataHandler = DataHandler;