const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });
const app = express();
const PORT = 5000 || process.env.PORT;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`server is running on port ${PORT}`);
});
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Successfully connected"))
  .catch((err) => console.error("Failed to connect"));

const User = require("./models/User");
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
    .then(() => res.json({ msg: "a new user was added successfully " }))
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
    .then(() => res.json({ msg: "the user was deleted !" }))
    .catch((err) => console.log(err));
});
