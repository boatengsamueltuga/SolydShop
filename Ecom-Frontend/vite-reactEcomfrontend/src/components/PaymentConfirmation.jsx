/**
 * @file PaymentConfirmation — Post-Stripe redirect confirmation page.
 * @description
 * - Reads `payment_intent`, `payment_intent_client_secret`, and `redirect_status` from URL query params.
 * - Dispatches `stripePaymentConfirmation` to confirm the payment with the backend on mount.
 * - Clears cart and localStorage checkout data on successful payment.
 * - Shows a loading skeleton while processing, then a success message with a check icon.
 * @usage App.jsx — route `/order-confirm` (authenticated users only).
 */
import { Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SkeletonFullPage from './shared/Skeleton';
import { stripePaymentConfirmation } from '../store/actions';
import toast from "react-hot-toast";


const PaymentConfirmation = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const dispatch  = useDispatch();
    const [errorMessage, setErrorMessage ] = useState("")
    const { cart } = useSelector((state) => state.carts);
    const [loading, setLoading] = useState(false);

    const paymentIntent = searchParams.get("payment_intent");
    const clientSecret = searchParams.get("payment_intent_client_secret");
    const redirectStatus = searchParams.get("redirect_status");
    
     
    const selectedUserCheckoutAddress = localStorage.getItem("CHECKOUT_ADDRESS")
    ? JSON.parse(localStorage.getItem("CHECKOUT_ADDRESS"))
    : null;

    useEffect(() => {
  if (
    paymentIntent &&
    clientSecret &&
    redirectStatus &&
    cart &&
    cart?.length > 0
  ) {

    const sendData = {
       addressId: selectedUserCheckoutAddress.addressId,
        pgName: "Stripe",
        pgPaymentId: paymentIntent,
        pgStatus: "Succeeded",
        pgResponseMessage: "Payment successful" 
    };
    console.log(selectedUserCheckoutAddress);
    console.log(sendData);
    dispatch(stripePaymentConfirmation(sendData, setErrorMessage, setLoading, toast));
  }
}, [paymentIntent, clientSecret, redirectStatus, cart]);


  return (
    <div className='min-h-screen flex items-center justify-center'>
      {
        loading ? (
            <div className='max-w-xl mx-auto'>
            <SkeletonFullPage />
            </div>
        ) : (
            <div className='p-8 rounded-lg shadow-lg text-center max-w-md mx-auto border  border-gray-200 bg-white'>
                <div className="text-green-500 mb-4 flex justify-center">
                    <FaCheckCircle  size={64} />
                </div>
                <h2 className='text-3xl font-bold text-gray-800 mb-2'>Payment Successful!</h2>
                <p>
                    Thank you for your purchase! Your payment was successful and we are
                    processing your order.
                </p>
            </div>
        )
      }
    </div>
  )
}

export default PaymentConfirmation
