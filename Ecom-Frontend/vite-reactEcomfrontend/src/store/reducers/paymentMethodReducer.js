/**
 * @file Payment method reducer — stores the user's selected payment method for checkout.
 *
 * @state {string|null} paymentMethod — Currently selected method ("stripe" or "paypal").
 *
 * @actions ADD_PAYMENT_METHOD.
 *
 * @usage PaymentMethod.jsx (Checkout step 2) — sets the selection.
 *        StripePayment.jsx / PaypalPayment.jsx — reads the selection to determine which payment UI to render.
 */
const initialState = {
  paymentMethod: null,
};

export const paymentMethodReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethod: action.payload,
      };
    default:
      return state;
  }
};
