const route = require("express").Router();
const departments = require("./departments");
const products = require("./products");
const rawMaterials = require("./rawMaterials");
const accounts = require("./accounts");
const employees = require("./employees");
const expenses = require("./expenses");
const attendance = require("./attendance");
const capitals = require("./capitals");
const salary = require("./salary");
const purchases = require("./purchases");
const sales = require("./sales");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose.connect(
  "mongodb+srv://arhex:hEllfun0300@arhex.arsz5at.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

route.use("/departments", departments);
route.use("/products", products);
route.use("/rawMaterials", rawMaterials);
route.use("/accounts", accounts);
route.use("/employees", employees);
route.use("/expenses", expenses);
route.use("/attendance", attendance);
route.use("/capitals", capitals);
route.use("/salary", salary);
route.use("/purchases", purchases);
route.use("/sales", sales);

module.exports = route;
