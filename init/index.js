const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});

  // 👇 yaha ek user banaya
  const user = new User({
    username: "dummyuser",
    email: "dummy@example.com",
  });
  await user.save();

  // 👇 ab owner ke andar wahi user._id
  const dataWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: user._id,
  }));

  await Listing.insertMany(dataWithOwner);
  console.log("data initialized ✅");
};

initDB();
