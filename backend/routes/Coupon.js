const express = require("express");
const {
    getAllCoupon,
    newCoupon,
} = require("../controllers/coupon");
const router = express.Router();


router.route("/coupon/new").post(newCoupon);

router.route("/coupon/all").get(getAllCoupon);




module.exports = router;
