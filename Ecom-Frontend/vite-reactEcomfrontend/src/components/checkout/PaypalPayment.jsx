/**
 * @file PayPal payment placeholder — displays a warning that PayPal is unavailable.
 *
 * @description
 * - Renders an MUI Alert (warning severity) prompting the user to use another payment method.
 * - This is a placeholder — PayPal integration is not yet implemented.
 *
 * @usage Checkout.jsx — rendered at step 3 when paymentMethod === "Paypal".
 */
import { Alert, AlertTitle } from '@mui/material'
import React from 'react'

const PaypalPayment = () => {
  return (
    <div className="h-96 flex justify-center items-center">
        <Alert severity="warning" variant='filled'  style={{maxWidth: "400px"}}>
        <AlertTitle>Paypal Unavailable</AlertTitle>
         Paypal payment is unavailable. Please use another payment method.
        </Alert>
    </div>
  )
}

export default PaypalPayment