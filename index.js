require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserRoute = require("./routes/userRoute");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/user", UserRoute);
app.get("/", (req, res)=>{
  res.send("hello to our fintech website");
})

app.get('/api/user/credit', (req, res) => {
  User.find({ creditCardNumber: { $exists: true } }, (err, users) => {
    if (err) {
      res.status(500).send({ error: 'Internal Server Error' });
    } else {
      res.send(users);
    }
  });
});

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
