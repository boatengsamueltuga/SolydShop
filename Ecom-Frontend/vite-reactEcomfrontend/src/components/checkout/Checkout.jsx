// import { Step, StepLabel, Stepper } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import AddressInfo from "./AddressInfo";
// import { useDispatch, useSelector } from "react-redux";
// import { getUserAddresses } from "../../store/actions";
// import { Button } from "@headlessui/react";
// import SkeletonPage from "../shared/Skeleton";
// import ErrorPage from "../shared/ErrorPage";
// import PaymentMethod from "./PaymentMethod";
// import toast from "react-hot-toast";
// import OrderSummary from "./OrderSummary";
// import StripePayment from "./StripePayment";
// import PaypalPayment from "./PaypalPayment";

// const Checkout = () => {
//   const [activeStep, setActiveStep] = useState(0);

//   const dispatch = useDispatch();

//   const { isLoading, errorMessage } = useSelector((state) => state.errors);
//   const { cart, totalPrice } = useSelector((state) => state.carts);
//   const { address, selectedUserCheckoutAddress } = useSelector(
//     (state) => state.auth
//   );
//   const { paymentMethod } = useSelector((state) => state.payment);

//   const steps = ["Address", "Payment Method", "Order Summary", "Payment"];

//   useEffect(() => {
//     dispatch(getUserAddresses());
//   }, [dispatch]);

//   const handleBack = () => {
//     setActiveStep((prevStep) => prevStep - 1);
//   };

//   const handleNext = () => {
//     if (activeStep === 0 && !selectedUserCheckoutAddress) {
//       toast.error("Please select checkout address before proceeding.");
//       return;
//     }

//     if (activeStep === 1 && !paymentMethod) {
//       toast.error("Please select payment method before proceeding.");
//       return;
//     }

//     setActiveStep((prevStep) => prevStep + 1);
//   };
//   console.log("Checkout render", { isLoading });

//   return (
//     <div className="py-14 pb-28 min-h-[calc(100vh-100px)]">
//       <Stepper activeStep={activeStep} alternativeLabel>
//         {steps.map((label, index) => (
//           <Step key={index}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       {isLoading ? (
//         <div className="lg:w-[80%] mx-auto py-5">
//           <SkeletonPage />
//         </div>
//       ) : (
//         <div className="mt-5">
//           {activeStep === 0 && <AddressInfo address={address} />}
//           {activeStep === 1 && <PaymentMethod />}
//           {activeStep === 2 && <OrderSummary
//                                        totalPrice={totalPrice} 
//                                        cart={cart}
//                                        address={selectedUserCheckoutAddress}
//                                         paymentMethod={paymentMethod}/>}
//           {activeStep === 3 && 
//             <>
//                {paymentMethod ==="Stripe" ? (
//                 <StripePayment />
//                ): (
//                 <PaypalPayment />
//                )}
//             </>}
                                        
//         </div>
//       )}

//       <div
//         className="fixed bottom-0 left-0 w-full h-24 bg-white border-t border-slate-200 px-4 flex items-center justify-between z-50"
//         style={{ boxShadow: "0 -2px 4px rgba(100,100,100,0.15)" }}
//       >
//         <Button
//           variant="outlined"
//           disabled={activeStep === 0}
//           onClick={handleBack}
//           className="border px-6 py-2 rounded-md"
//         >
//           Back
//         </Button>

//         {activeStep !== steps.length - 1 && (
//           <button
//             disabled={
//               errorMessage ||
//               (activeStep === 0 && !selectedUserCheckoutAddress) ||
//               (activeStep === 1 && !paymentMethod)
//             }
//             className={`bg-custom-blue font-semibold px-6 h-10 rounded-md text-white ${
//               errorMessage ||
//               (activeStep === 0 && !selectedUserCheckoutAddress) ||
//               (activeStep === 1 && !paymentMethod)
//                 ? "opacity-60"
//                 : ""
//             }`}
//             onClick={handleNext}
//           >
//             Proceed
//           </button>
//         )}
//       </div>

//       {errorMessage && <ErrorPage message={errorMessage} />}
//     </div>
//   );
// };

// export default Checkout;


/**
 * @file Checkout page — 4-step MUI Stepper flow: Address → Payment Method → Order Summary → Payment.
 *
 * @description
 * - Step 0: `<AddressInfo>` — select or add a shipping address.
 * - Step 1: `<PaymentMethod>` — choose Stripe or PayPal; syncs local cart to server.
 * - Step 2: `<OrderSummary>` — read-only review of address, items, and totals.
 * - Step 3: `<StripePayment>` or `<PaypalPayment>` — complete the payment.
 * - "Back" / "Proceed" buttons are fixed at the bottom of the viewport.
 * - Validates that an address is selected (step 0) and payment method chosen (step 1) before proceeding.
 *
 * @usage App.jsx — route `/checkout` (authenticated users only).
 */
import { Step, StepLabel, Stepper } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddressInfo from "./AddressInfo";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddresses } from "../../store/actions";
import { Button } from "@headlessui/react";
import ErrorPage from "../shared/ErrorPage";
import PaymentMethod from "./PaymentMethod";
import toast from "react-hot-toast";
import OrderSummary from "./OrderSummary";
import StripePayment from "./StripePayment";
import PaypalPayment from "./PaypalPayment";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);

  const dispatch = useDispatch();

  // ⬇️ FIX: removed global isLoading dependency
  const { errorMessage } = useSelector((state) => state.errors);
  const { cart, totalPrice } = useSelector((state) => state.carts);
  const { address, selectedUserCheckoutAddress } = useSelector(
    (state) => state.auth
  );
  const { paymentMethod } = useSelector((state) => state.payment);

  const steps = ["Address", "Payment Method", "Order Summary", "Payment"];

  useEffect(() => {
    dispatch(getUserAddresses());
  }, [dispatch]);

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedUserCheckoutAddress) {
      toast.error("Please select checkout address before proceeding.");
      return;
    }

    if (activeStep === 1 && !paymentMethod) {
      toast.error("Please select payment method before proceeding.");
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  return (
    <div className="py-14 pb-28 min-h-[calc(100vh-100px)]">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* ⬇️ FIX: always render checkout steps */}
      <div className="mt-5">
        {activeStep === 0 && <AddressInfo address={address} />}
        {activeStep === 1 && <PaymentMethod />}
        {activeStep === 2 && (
          <OrderSummary
            totalPrice={totalPrice}
            cart={cart}
            address={selectedUserCheckoutAddress}
            paymentMethod={paymentMethod}
          />
        )}
        {activeStep === 3 &&
          (paymentMethod === "Stripe" ? (
            <StripePayment />
          ) : (
            <PaypalPayment />
          ))}
      </div>

      <div
        className="fixed bottom-0 left-0 w-full h-24 bg-white border-t border-slate-200 px-4 flex items-center justify-between z-50"
        style={{ boxShadow: "0 -2px 4px rgba(100,100,100,0.15)" }}
      >
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
          className="border px-6 py-2 rounded-md"
        >
          Back
        </Button>

        {activeStep !== steps.length - 1 && (
          <button
            disabled={
              errorMessage ||
              (activeStep === 0 && !selectedUserCheckoutAddress) ||
              (activeStep === 1 && !paymentMethod)
            }
            className={`bg-custom-blue font-semibold px-6 h-10 rounded-md text-white ${
              errorMessage ||
              (activeStep === 0 && !selectedUserCheckoutAddress) ||
              (activeStep === 1 && !paymentMethod)
                ? "opacity-60"
                : ""
            }`}
            onClick={handleNext}
          >
            Proceed
          </button>
        )}
      </div>

      {errorMessage && <ErrorPage message={errorMessage} />}
    </div>
  );
};

export default Checkout;
