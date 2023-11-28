const Coupon = require("../models/coupon.js");


exports.newCoupon = async (req, res, next) => {
  const {
    amount,
    code
  } = req.body;

  const order = await Coupon.create({
    amount,
    code,
  });

  
  res.status(201).json({
    success: true,
    order,
  });
};

exports.getAllCoupon = async (req, res, next) => {
  const order = await Coupon.find()


  res.status(200).json({
    success: true,
    order,
  });
};

