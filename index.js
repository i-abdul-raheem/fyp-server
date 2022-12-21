const express = require("express");
const app = express();
const cors = require("cors");
const route = require("./routes/index");
app.use(cors());
require("dotenv").config();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello");
});

app.use(route);

app.listen(PORT, () => {
    console.log(`Server started at: http://localhost:${PORT}`);
});