import React, { Fragment, useEffect, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import axios from "axios";

const ConfirmOrder = ({ history }) => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.18;

  
  let totalPrice = subtotal + tax + shippingCharges;
  let totalPrices;
  const [totalP, setTotalP] = useState(totalPrice);
  const [coupon,setCoupon]=useState([])
  useEffect(()=>{
 
     axios.get("/api/v1/coupon/all").then((item)=>{
      
      setCoupon(item.data.order)
    })
    
},[])

const [selectedAmount, setSelectedAmount] = useState("");

const handleSelectChange = (event) => {
  setSelectedAmount(event.target.value);
};
const [selectedAmountshow, setSelectedAmountshow] = useState(false);
  const apply = () => {
    if(selectedAmount){
      setSelectedAmountshow(true)
      totalPrices = subtotal + tax + shippingCharges - selectedAmount;
      setTotalP(totalPrices);
    }
  };
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalP,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    history.push("/process/payment");
  };

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>{item.name}</Link>{" "}
                    <span>
                      {item.quantity} X ₹{item.price} = <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summery</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>
            <div >
            <span >  Apply Coupon</span>
            <select value={selectedAmount} onChange={handleSelectChange} className="apply">
              <option>select the Coupon</option>
  {coupon.map((item) => (
    <option value={item.amount} key={item._id}>
     Coupon-Code:{item.code} Amount:{item.amount}Rs
    </option>
  ))}
</select>
              <span className="applyButtoon" onClick={apply}>Apply</span>
            </div>
            <div className="orderSummaryTotal">
            <b>Actual Price:</b>   <span>₹{totalPrice}</span>
            </div>
            {selectedAmountshow && (
              <div className="orderSummaryTotals">
<b>Discount:  </b> <span>-₹{selectedAmount}</span>
</div>)}
            <div className="orderSummaryTotal">
         
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalP}</span>
            </div>

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
