const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code:{
    type:String
  },
  amount:{
    type:Number
  }
});

module.exports = mongoose.model("coupon", couponSchema);

