const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  restaurant_id: Number,
  name: String,
  borough: String,
  cuisine: String,
  address: {
    building: String,
    street: String,
    zipcode: String,
    coord: [Number]
  },
  grades: [
    {
      date: Date,
      grade: String,
      score: Number
    }
  ]
}, { collection: "restaurants" }); // Use exact collection name from MongoDB

module.exports = mongoose.model("Restaurant", restaurantSchema);
