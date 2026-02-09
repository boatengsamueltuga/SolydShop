/**
 * @file Persistent top navigation bar — renders on every route above `<Routes>`.
 *
 * @description
 * - Displays brand logo ("SolydShop"), main nav links (Home, Products, About, Contact),
 *   a cart icon with MUI Badge (item count), and Login button or UserMenu (if authenticated).
 * - Responsive: collapses into a hamburger menu on small screens (`sm:hidden`).
 * - Active link highlighted via `useLocation().pathname` comparison.
 *
 * @usage App.jsx — rendered inside `<Router>`, outside `<Routes>`.
 */
import { Badge } from "@mui/material";
import { FaShoppingCart, FaSignInAlt, FaStore } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoIosMenu } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import UserMenu from "../UserMenu";

const Navbar = () => {
  const path = useLocation().pathname;
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { cart } = useSelector((state) => state.carts);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="h-[70px] bg-custom-gradient text-white z-50 flex items-center sticky top-0">
      <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between items-center">

        <Link to="/" className="flex items-center text-2xl font-bold">
          <FaStore className="mr-2 text-3xl" />
          <span className="font-[Poppins]">SolydShop</span>
        </Link>

        <ul
          className={`flex sm:gap-4 gap-2 sm:items-center text-white sm:static
          absolute left-0 top-[70px] sm:shadow-none shadow-md ${
            navbarOpen ? "h-fit sm:pb-0 pb-5" : "h-0 overflow-hidden"
          } transition-all duration-100 sm:h-fit sm:bg-none bg-custom-gradient
          sm:w-fit w-full sm:flex-row flex-col px-4 sm:px-0`}
        >
          <li>
            <Link className={`${path === "/" ? "font-semibold" : "opacity-80"}`} to="/">
              Home
            </Link>
          </li>

          <li>
            <Link className={`${path === "/products" ? "font-semibold" : "opacity-80"}`} to="/products">
              Products
            </Link>
          </li>

          <li>
            <Link className={`${path === "/about" ? "font-semibold" : "opacity-80"}`} to="/about">
              About
            </Link>
          </li>

          <li>
            <Link className={`${path === "/contact" ? "font-semibold" : "opacity-80"}`} to="/contact">
              Contact
            </Link>
          </li>

          <li>
            <Link className={`${path === "/cart" ? "font-semibold" : "opacity-80"}`} to="/cart">
              <Badge
                showZero
                badgeContent={cart?.length || 0}
                color="primary"
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <FaShoppingCart size={25} />
              </Badge>
            </Link>
          </li>

          {(user && user.id) ? (
            <li className="font-[500] transition-all duration-150">
             <UserMenu /> 
            </li>
          ): (
          <li className="font-[500] transition-all duration-150">
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-[6px] bg-gradient-to-r 
              from-purple-600 to-red-500 text-white font-semibold rounded-md shadow-lg"
            >
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          </li>
          )}
        </ul>

        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="sm:hidden flex items-center"
        >
          {navbarOpen ? (
            <RxCross2 className="text-white text-3xl" />
          ) : (
            <IoIosMenu className="text-white text-3xl" />
          )}
        </button>

      </div>
    </div>
  );
};

export default Navbar;
