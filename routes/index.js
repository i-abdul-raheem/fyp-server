const route = require("express").Router();
const departments = require("./departments");
const products = require("./products");
const rawMaterials = require("./rawMaterials");
const accounts = require("./accounts");
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

module.exports = route;
