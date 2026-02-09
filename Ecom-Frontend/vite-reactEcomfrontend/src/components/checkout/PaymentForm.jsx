/**
 * @file Stripe payment form — renders the Stripe PaymentElement and handles confirmation.
 *
 * @description
 * - Uses `useStripe()` and `useElements()` from `@stripe/react-stripe-js`.
 * - Renders a Stripe `<PaymentElement>` with "tabs" layout.
 * - On submit, calls `stripe.confirmPayment()` with a `return_url` pointing to `/order-confirm`.
 * - Displays error messages if payment fails.
 * - Shows `<SkeletonFullPage>` until Stripe Elements are ready.
 *
 * @param {Object} props
 * @param {string} props.clientSecret — Stripe PaymentIntent client secret.
 * @param {number} props.totalPrice   — Total price to display on the Pay button.
 *
 * @usage StripePayment.jsx — rendered inside `<Elements>` provider.
 */
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import SkeletonFullPage from '../shared/Skeleton';

const PaymentForm = ({ clientSecret, totalPrice }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    if(!stripe || !elements){
        return;
    }

    const  { error: submitError } = await elements.submit();

    const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams:{
            return_url: `${import.meta.env.VITE_FRONTEND_URL}/order-confirm`,
        },
  
    });

    if(error){
        setErrorMessage(error.message);
        return false;
    }

    };

//    console.log("REDUX totalPrice:", totalPrice);
//    console.log("TYPE:", typeof totalPrice);

     const paymentElementOptions = {
        layout: "tabs",
     }

   const isLoading = !clientSecret || !stripe || !elements;

  return (
    <form onSubmit={handleSubmit}  className='max-w-lg mx-auto p-4'>
      <h2 className='text-xl font-semibold mb-4'>Payment Information</h2>
      {isLoading ? (
        <SkeletonFullPage />
      ) :(
       <>
       {clientSecret && <PaymentElement options={paymentElementOptions}/>}
       {errorMessage && (
        <div className='text-red-500 mt-2'>{errorMessage}</div>
       )}

       <button
        className='text-white w-full px-5 py-[10px] bg-black mt-2 
        rounded-md font-bold disabled:opacity-50 disabled:animate-pulse' 
         disabled={!stripe || isLoading}>
           {!isLoading ? `Pay $${Number(totalPrice).toFixed(2)}`
                   : "Processing"}
       </button>
       </>
      )}
    </form>
  )
}

export default PaymentForm


// import React, { useState } from 'react';
// import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
// import SkeletonFullPage from '../shared/Skeleton';

// const PaymentForm = ({ clientSecret, totalPrice }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//   };

//   console.log("REDUX totalPrice:", totalPrice);
//   console.log("TYPE:", typeof totalPrice);

//   const paymentElementOptions = {
//     layout: "tabs",
//   };

//   const displayAmount =
//     Number.isFinite(Number(totalPrice))
//       ? Number(totalPrice).toFixed(2)
//       : "0.00";

//   return (
//     <form onSubmit={handleSubmit} className='max-w-lg mx-auto p-4'>
//       <h2 className='text-xl font-semibold mb-4'>Payment Information</h2>

//       {loading ? (
//         <SkeletonFullPage />
//       ) : (
//         <>
//           {clientSecret && (
//             <PaymentElement options={paymentElementOptions} />
//           )}

//           {errorMessage && (
//             <div className='text-red-500 mt-2'>{errorMessage}</div>
//           )}

//           <button disabled={!stripe || loading}>
//             {!loading ? `Pay $${displayAmount}` : "Processing"}
//           </button>
//         </>
//       )}
//     </form>
//   );
// };

// export default PaymentForm;
