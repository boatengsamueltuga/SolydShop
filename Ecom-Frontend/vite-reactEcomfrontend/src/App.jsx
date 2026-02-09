
// import './App.css'
// import Home from './components/home/Home'
// import Products from './components/products/Products'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Navbar from './components/shared/Navbar'
// import About from './components/About'
// import Contact from './components/Contact'
// import { Toaster } from 'react-hot-toast'
// import React,{ useState } from 'react'
// import Cart from './components/carts/Cart'
// import LogIn from './components/auth/LogIn'
// import PrivateRoute from './components/PrivateRoute'
// import Register from './components/auth/Register'
// import Checkout from './components/checkout/Checkout'
// import PaymentConfirmation from './components/PaymentConfirmation'
// import AdminLayout from './components/Admin/AdminLayout'
// import Dashboard from './components/Admin/dashboard/Dashboard'
// import AdminProducts from './components/Admin/products/AdminProducts'
// import Sellers from './components/Admin/sellers/Sellers'
// import Category from './components/Admin/categories/Category'
// import Orders from './components/Admin/orders/Orders'



// function App() {
 

//   return (
//     <React.Fragment>
//    <Router>
//     <Navbar />
//     <Routes>
//       <Route path='/' element={ <Home />}/>
//       <Route path='/products' element={ <Products />}/>
//       <Route path='/about' element={ <About />}/>
//       <Route path='/contact' element={ <Contact/>}/>
//       <Route path='/cart' element={ <Cart/>}/>

//       <Route path ='/' element={<PrivateRoute />}>
//         <Route path='/checkout' element={ <Checkout />}/>
//         <Route path='/order-confirm' element={ <PaymentConfirmation />}/>
//       </Route>


//       <Route path ='/' element={<PrivateRoute publicPage />}>
//         <Route path='/Login' element={ <LogIn/>}/>
//         <Route path='/register' element={ <Register/>}/>
//       </Route>

//       <Route path ='/' element={<PrivateRoute adminOnly/>}>
//         <Route path='/admin' element={ <AdminLayout />}>
//           <Route path='' element={<Dashboard />}/>
//           <Route path='products' element={<AdminProducts />}/>
//           <Route path='sellers' element={<Sellers />}/>
//           <Route path='orders' element={<Orders />}/>
//           <Route path='categories' element={<Category />}/>
//         </Route>
         
//       </Route>

//     </Routes>
//    </Router>
//    <Toaster position='bottom-center'/>
//     </React.Fragment>
//   )
// }

// export default App

/**
 * @file Root application component — defines the full route table and persistent layout.
 *
 * @description
 * - Wraps all routes in `BrowserRouter` with a persistent `<Navbar />` above `<Routes>`.
 * - `<Toaster />` sits outside the Router for global toast notifications on every page.
 * - Route groups are wrapped by `<PrivateRoute>` layout routes for access control:
 *     • Public routes   — accessible to everyone (Home, Products, About, Contact, Cart).
 *     • User routes     — require authentication (Checkout, PaymentConfirmation).
 *     • Guest routes    — `publicPage` flag; logged-in users are redirected (Login, Register).
 *     • Admin routes    — `adminOnly` flag; restricted to ROLE_ADMIN / ROLE_SELLER.
 *
 * @usage Rendered by main.jsx inside the Redux <Provider>.
 */
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/shared/Navbar";
import Home from "./components/home/Home";
import Products from "./components/products/Products";
import About from "./components/About";
import Contact from "./components/Contact";
import Cart from "./components/carts/Cart";

import LogIn from "./components/auth/LogIn";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/PrivateRoute";

import Checkout from "./components/checkout/Checkout";
import PaymentConfirmation from "./components/PaymentConfirmation";

import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./components/Admin/dashboard/Dashboard";
import AdminProducts from "./components/Admin/products/AdminProducts";
import Sellers from "./components/Admin/sellers/Sellers";
import Orders from "./components/Admin/orders/Orders";
import Category from "./components/Admin/categories/Category";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />

          {/* Protected User Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirm" element={<PaymentConfirmation />} />
          </Route>

          {/* Auth Routes (only for logged-out users) */}
          <Route element={<PrivateRoute publicPage />}>
            <Route path="login" element={<LogIn />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute adminOnly />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="sellers" element={<Sellers />} />
              <Route path="orders" element={<Orders />} />
              <Route path="categories" element={<Category />} />
            </Route>
          </Route>
        </Routes>
      </Router>

      <Toaster position="bottom-center" />
    </React.Fragment>
  );
}

export default App;
