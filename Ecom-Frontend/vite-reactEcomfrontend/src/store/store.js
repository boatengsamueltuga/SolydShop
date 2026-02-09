// import { configureStore } from "@reduxjs/toolkit";
// import { productReducer } from "./reducers/ProductReducer";
// import { errorReducer } from "./reducers/errorReducer";
// import { cartReducer } from "./reducers/cartReducer";
// import { authReducer } from "./reducers/authReducer";
// import { paymentMethodReducer } from "./reducers/paymentMethodReducer";

// // 

// const cartItemsFromStorage = localStorage.getItem("cartItems");
// let cartItems = [];
// try {
//   cartItems = cartItemsFromStorage
//     ? JSON.parse(cartItemsFromStorage)
//     : [];
// } catch {
//   cartItems = [];
// };

// const selectedUserCheckoutAddress = localStorage.getItem("CHECKOUT_ADDRESS");
// let cartItemsInStorage = [];
// try {
//   cartItemsInStorage = selectedUserCheckoutAddress
//     ? JSON.parse(selectedUserCheckoutAddress)
//     : [];
// } catch {
//   cartItemsInStorage = [];
// };
 
// // Load user information from localStorage if it exists (used to persist login state)
// const user = localStorage.getItem("auth")
//   ? JSON.parse(localStorage.getItem("auth"))
//   : null;
// // const cartItems = localStorage.getItem("cartItems")
// //   ? JSON.parse(localStorage.getItem("cartItems"))
// //   : [];

// // Initializes the Redux store with persisted authentication and cart data
// // 

// const initialState = {
//   auth: {
//     user: user,
//     address: [],
//     selectedUserCheckoutAddress,
//   },
//   carts: {
//     cart: cartItems,
//   },
// };


// export const store = configureStore({
//   reducer: {
//     products: productReducer,
//     errors: errorReducer,
//     carts: cartReducer,
//     auth: authReducer,
//     payment: paymentMethodReducer,
//   },
//   preloadedState: initialState,
// });

// export default store;


/**
 * @file Redux store configuration with localStorage-based state hydration.
 *
 * @description
 * - Combines 8 reducer slices into a single store via RTK's `configureStore`.
 * - Hydrates `auth` (user session), `carts` (cart items), and checkout address
 *   from localStorage on app load via `preloadedState`.
 * - Persistence writes happen inside individual action creators (manual, no redux-persist).
 *
 * @usage Imported by main.jsx and wrapped in `<Provider store={store}>`.
 */
import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./reducers/ProductReducer";
import { errorReducer } from "./reducers/errorReducer";
import { cartReducer } from "./reducers/cartReducer";
import { authReducer } from "./reducers/authReducer";
import { paymentMethodReducer } from "./reducers/paymentMethodReducer";
import { adminReducer } from "./reducers/adminReducer";
import { orderReducer } from "./reducers/orderReducer";
import { sellerReducer } from "./reducers/sellerReducer";

// =========================
// Load Cart Items
// =========================
const cartItemsFromStorage = localStorage.getItem("cartItems");
let cartItems = [];
try {
  cartItems = cartItemsFromStorage
    ? JSON.parse(cartItemsFromStorage)
    : [];
} catch {
  cartItems = [];
}

// =========================
// FIX: Load Checkout Address (PARSED)
// =========================
const selectedUserCheckoutAddress = localStorage.getItem("CHECKOUT_ADDRESS")
  ? JSON.parse(localStorage.getItem("CHECKOUT_ADDRESS"))
  : null;

// =========================
// Load Auth User
// =========================
const user = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth"))
  : null;

// =========================
// Initial State
// =========================
const initialState = {
  auth: {
    user: user,
    address: [],
    selectedUserCheckoutAddress,
  },
  carts: {
    cart: cartItems,
  },
};

// =========================
// Store
// =========================
export const store = configureStore({
  reducer: {
    products: productReducer,
    errors: errorReducer,
    carts: cartReducer,
    auth: authReducer,
    payment: paymentMethodReducer,
    admin: adminReducer,
    order: orderReducer,
    seller: sellerReducer,
  },
  preloadedState: initialState,
});

export default store;
