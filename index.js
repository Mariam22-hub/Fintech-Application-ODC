require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserRoute = require("./routes/userRoute");
const cardRoute = require("./routes/cardRoute");
const operationRoute = require("./routes/operationRoute");
const productRoute = require("./routes/productRoute");
const childRoute = require("./routes/childRoute");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/user", UserRoute);
app.use("/api/credit", cardRoute);
app.use("/api/operations", operationRoute);
app.use("/api/products", productRoute);
app.use("/api/child", childRoute);

app.get("/", (req, res)=>{
  res.send("hello to our fintech website");
})


app.listen(process.env.PORT, () => {
  console.log("Server listining on port " + process.env.PORT);
  mongoose
    .connect(process.env.URL)
    .then((data) => {
      console.log("connect to database : ", data.connection.name);
    })
    .catch((err) => {
      console.log("Error : ", err);
    });
});
