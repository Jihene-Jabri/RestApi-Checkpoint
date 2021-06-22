// Let The Games Begin...!

const express = require("express");
const mongoose = require("mongoose");

// Configure the environment variables with .env
require("dotenv").config({ path: "./config/.env" });
const app = express();

//  LUNCH THE SERVER
const PORT = 5000 || process.env.PORT;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`server is running on port ${PORT}`);
});

// CONNECT THE DATABASE LOCALLY
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Successfully connected"))
  .catch((err) => console.error("Failed to connect"));

//  CALL THE SHECMA
const User = require("./models/User");

//   THE SENTENCE WHICH EVERYBODY FORGETS, INCLUDING MEEE !
app.use(express.json());

//  RETURN ALL USERS
app.get("/all_Users", (req, res) =>
  User.find()
    .then((users) => res.json(users))
    .catch((err) => console.log(err))
);

//   ADD A NEW USER TO THE DATABASE
app.post("/add_User", (req, res) => {
  const { lastName, firstName, email, adress } = req.body;
  let newUser = new User({ lastName, firstName, email, adress });
  newUser
    .save()
    .then(() => res.json({ message: "A new user was added successfully " }))
    .catch((err) => console.log(err));
});

// EDIT A USER BY ID

app.put("/edit_User/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, (err) => {
    if (err) throw err;
    User.findById(req.params.id)
      .then((el) => res.json(el))
      .catch((err) => console.log(err));
  });
});

// REMOVE A USER BY ID
app.delete("/delete_User/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: "the user was successfully deleted !" }))
    .catch((err) => console.log(err));
});
