import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  user: mongoose.Schema.Types.ObjectId,
});
const Product = mongoose.model("Product", productSchema);

const query1 = { $or: [{ userId: '65f0b8a3e4b0a1a2b3c4d5e6' }, { user: '65f0b8a3e4b0a1a2b3c4d5e6' }] };
console.log("Valid ID:", JSON.stringify(Product.find(query1).getFilter()));

const query2 = { $or: [{ userId: undefined }, { user: undefined }] };
console.log("Undefined ID:", JSON.stringify(Product.find(query2).getFilter()));

const query3 = { $or: [{ userId: null }, { user: null }] };
console.log("Null ID:", JSON.stringify(Product.find(query3).getFilter()));
