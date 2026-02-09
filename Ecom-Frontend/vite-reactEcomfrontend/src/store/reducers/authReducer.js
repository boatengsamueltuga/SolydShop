/**
 * @file Auth reducer — manages user session, addresses, and Stripe client secret.
 *
 * @state {Object|null} user                        — Authenticated user object (null when logged out).
 * @state {Array}       address                     — User's saved addresses fetched from the API.
 * @state {string|null} clientSecret                — Stripe PaymentIntent client secret for checkout.
 * @state {Object|null} selectedUserCheckoutAddress — The address chosen for the current checkout flow.
 *
 * @actions LOGIN_USER, LOG_OUT, USER_ADDRESS, SELECT_CHECKOUT_ADDRESS,
 *          REMOVE_CHECKOUT_ADDRESS, CLIENT_SECRET, REMOVE_CLIENT_SECRET_ADDRESS.
 *
 * @usage PrivateRoute, Navbar, LogIn, Register, Checkout, AddressInfo, StripePayment.
 */
const initialState ={
    user: null,
    address: [],
    clientSecret: null,
    selectedUserCheckoutAddress: null,
}
export const authReducer = (state = initialState, action) =>{
    // return state; this is the code before action was introduced

switch (action.type) {
    case "LOGIN_USER":
        return {...state, user: action.payload};

        case "USER_ADDRESS":
        return {...state, address: action.payload};

         case "SELECT_CHECKOUT_ADDRESS":
        return {...state, selectedUserCheckoutAddress: action.payload};
        
        case "REMOVE_CHECKOUT_ADDRESS":
         return { ...state, selectedUserCheckoutAddress:null};

         case "CLIENT_SECRET":
         return { ...state, clientSecret:action.payload };

          case "REMOVE_CLIENT_SECRET_ADDRESS":
         return { ...state, clientSecret:null, selectedUserCheckoutAddress: null};

        case "LOG_OUT":
        return {
            ...state,
            user: null,
            address: [],
        };  

    default:
        return state;
}

}