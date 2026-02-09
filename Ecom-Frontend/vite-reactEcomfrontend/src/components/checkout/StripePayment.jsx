/**
 * @file Stripe payment wrapper — creates a PaymentIntent and provides the Elements context.
 *
 * @description
 * - Loads Stripe.js via `loadStripe(VITE_STRIPE_PUBLISHABLE_KEY)`.
 * - On mount (if no clientSecret exists), dispatches `createStripePaymentSecret` to create a PaymentIntent.
 * - Once clientSecret is available, wraps `<PaymentForm>` in `<Elements>` with the secret as an option.
 * - Shows `<SkeletonFullPage>` while the PaymentIntent is being created.
 *
 * @usage Checkout.jsx — rendered at step 3 when paymentMethod === "Stripe".
 */
import { Alert, AlertTitle } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import PaymentForm from './PaymentForm';
import { loadStripe } from '@stripe/stripe-js';
import { createStripePaymentSecret } from '../../store/actions';
import { Elements } from '@stripe/react-stripe-js';
import SkeletonFullPage from '../shared/Skeleton';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePayment = () => {
  const dispatch = useDispatch();
  const { clientSecret } = useSelector((state) => state.auth);
  const { totalPrice } = useSelector((state) => state.carts);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const { user, selectedUserCheckoutAddress} = useSelector((state) => state.auth);

  useEffect(() => {
    if(!clientSecret){

      const sendData ={
        amount: Number(totalPrice) * 100,
        currency: "usd",
        email: user.email,
        name: `${user.username}`,
        address: selectedUserCheckoutAddress,
        description: `Order for ${user.email}`,
        metadata: {
          test: "1"
        }
      };
      dispatch(createStripePaymentSecret(sendData));
    }
  },  [clientSecret]);

  if(isLoading){
    return (
      <div className='max-w-lg mx-auto'>
        <SkeletonFullPage />
      </div>
    )
  }
  //code to confirm if pk was defined or not 
  // console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  return (
    <>
    {clientSecret && (
     <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm  clientSecret={clientSecret} totalPrice={totalPrice}/>

      </Elements>
    )}
    </>
  )
}

export default StripePayment