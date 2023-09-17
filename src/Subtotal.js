import React from 'react'
import './Subtotal.css'
import CurrencyFormat from 'react-currency-format';
import { useStateValue } from './StateProvider';
import { getBasketTotal } from './Reducer';
import { useNavigate } from 'react-router-dom';

function Subtotal() {
    const [{ basket }] = useStateValue()
    const navigate = useNavigate()

    return (
        <div className='subtotal'>
            <CurrencyFormat
             renderText={(value) =>{
               return <>
                <p>
                    Subtotal of ({basket.length} items): <strong>{value}</strong>
                </p>
                <small className='subtotal__gift'>
                    <input type="checkbox" />This order contains a gift
                </small>
                </>
             }}
             decimalScale={2}
             value={getBasketTotal(basket)}
             displayType={'text'}
             thousandSeparator = {true}
             prefix={'$'}
             
            />
            <button onClick={e => navigate('/payment')} className='checkout__button'>Proceed to Checkout</button>
        </div>
    )
}

export default Subtotal
