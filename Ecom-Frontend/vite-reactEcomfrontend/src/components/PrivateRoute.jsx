// import React from 'react'
// import { useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';

// const PrivateRoute = ({ publicPage = false }) => {
//     const  { user } = useSelector((state) => state.auth);

//     if(publicPage){
//         return user ? <Navigate to="/profile" /> : <Outlet/>
//     }
//   return user ? <Outlet /> : <Navigate to="/login" />;
// }

// export default PrivateRoute

// import { useSelector } from "react-redux";
// import { Navigate, Outlet, useLocation } from "react-router-dom";

// const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
//   const { user } = useSelector((state) => state.auth);
//   const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
//   const isSeller = user && user?.roles.includes("ROLE_SELLER");
//   const location  = useLocation();

//   if (publicPage) {
//     return user ? <Navigate to="/" /> : <Outlet />;
//   }

//   if(adminOnly){
//     if(isSeller && !isAdmin){
//     const sellerAllowedPaths = ["/admin/orders", "/admin/products"];
//     const sellerAllowed = sellerAllowedPaths.some(path =>
//       location.pathname.startsWith(path)
//     );
//     if(!sellerAllowed){
//       return <Navigate to="/" replace/>
//     }
//     }
//   }
//   if(!isAdmin && !isSeller){
//       return <Navigate to="/" />
//     }
//   return user ? <Outlet /> : <Navigate to="/login" />;
// };



/**
 * @file Route guard — layout-route component that controls access to child routes via `<Outlet />`.
 *
 * @description
 * Uses three modes controlled by boolean props:
 * 1. `publicPage` — Inverts guard: logged-in users redirect to `/`, guests see the page (Login/Register).
 * 2. `adminOnly`  — Requires ROLE_ADMIN (full) or ROLE_SELLER (restricted to /admin/orders, /admin/products).
 * 3. Default      — Standard auth guard: unauthenticated users redirect to `/login`.
 *
 * All redirects use `replace` to avoid polluting browser history.
 *
 * @param {Object}  props
 * @param {boolean} [props.publicPage=false] — When true, only unauthenticated users may access.
 * @param {boolean} [props.adminOnly=false]  — When true, requires admin or seller role.
 * @returns {JSX.Element} `<Outlet />` if authorized, `<Navigate />` if denied.
 *
 * @usage App.jsx — wraps route groups: `<Route element={<PrivateRoute />}>`,
 *        `<Route element={<PrivateRoute publicPage />}>`, `<Route element={<PrivateRoute adminOnly />}>`.
 */
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isSeller = user?.roles?.includes("ROLE_SELLER");

  // PUBLIC PAGES (login, register)
  if (publicPage) {
    return user ? <Navigate to="/" replace /> : <Outlet />;
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ADMIN-ONLY ROUTES
  if (adminOnly) {
    // Seller restrictions
    if (isSeller && !isAdmin) {
      const sellerAllowedPaths = ["/admin/orders", "/admin/products"];
      const sellerAllowed = sellerAllowedPaths.some((path) =>
        location.pathname.startsWith(path)
      );

      if (!sellerAllowed) {
        return <Navigate to="/" replace />;
      }
    }

    // Neither admin nor seller
    if (!isAdmin && !isSeller) {
      return <Navigate to="/" replace />;
    }
  }

  // NORMAL AUTHENTICATED ROUTES (checkout, etc.)
  return <Outlet />;
};

export default PrivateRoute;
