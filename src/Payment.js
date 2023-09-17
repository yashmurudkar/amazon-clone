import React, { useEffect, useState } from "react";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from './Reducer';
import axios from "axios";

function Payment() {
  const [{ basket, user }] = useStateValue();
  const navigate = useNavigate()

  const stripe =  useStripe()
  const elements = useElements()

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [succeeeded, setSucceeeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() =>{
    //generate the special stripe secret which allows us to charge  a customer

    const getClientSecret = async ()=>{
      try{
      const response = await axios.post (
        // Stripe expects the total in a currencies subunits (like for dollar its cents)
        `/payments/create?total=${getBasketTotal(basket) * 100}`
        
      )
      setClientSecret(response.data.clientSecret)
    }
       catch(error){}
      
    }
    getClientSecret()
  },[])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true)

    const payload =await stripe.confirmCardPayment(clientSecret , {
      payment_method :{
        card: elements.getElement(CardElement)
      }
    }).then(({ paymentIntent }) =>{
      //paymentIntent = payment confirmation

      setSucceeeded(true)
      setError(null)
      setProcessing(false)

      //navigate push is not used because we don't want to come back to payment page
      navigate.replace('/order')
    })
  };

  const handleChange = event => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items </Link>)
        </h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>

          <div className="payment__address">
            <p>{user?.email}</p>
            <p>23 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>

        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>

          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                price={item.price}
                rating={item.rating}
                image={item.image}
              />
            ))}
          </div>
        </div>

        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>

          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => {
                    return (
                      <>
                        <p>
                          Subtotal of ({basket.length} items):{" "}
                          <strong>{value}</strong>
                        </p>
                        <small className="subtotal__gift">
                          <input type="checkbox" />
                          This order contains a gift
                        </small>
                      </>
                    );
                  }}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled ={processing || disabled || succeeeded}>
                <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
              </button>
              </div>
              
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
