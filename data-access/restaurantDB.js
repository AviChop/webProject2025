const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant"); // Adjust path if needed

let RestaurantModel;

module.exports.initialize = function (connectionString) {
  return new Promise((resolve, reject) => {
    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        RestaurantModel = Restaurant;
        console.log("MongoDB connected and RestaurantModel initialized");
        resolve();
      })
      .catch(err => reject(err));
  });
};

module.exports.addNewRestaurant = (data) => new RestaurantModel(data).save();

module.exports.getAllRestaurants = (page, perPage, borough) => {
  const query = borough ? { borough: { $regex: `^${borough}$`, $options: "i" } } : {};
  return RestaurantModel.find(query)
    .sort({ restaurant_id: 1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();
};

module.exports.getRestaurantById = (id) => RestaurantModel.findById(id).exec();

module.exports.updateRestaurantById = (data, id) =>
  RestaurantModel.updateOne({ _id: id }, { $set: data }).exec();

module.exports.deleteRestaurantById = (id) =>
  RestaurantModel.deleteOne({ _id: id }).exec();
