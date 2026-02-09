/**
 * @file Empty cart placeholder — shown when the cart has no items.
 *
 * @description
 * - Displays a shopping cart icon, "Your Cart is Empty" message, and a "Start Shopping" link to `/`.
 *
 * @usage Cart.jsx — rendered when `cart.length === 0`.
 */
import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";

const CartEmpty = () => {
  return (
    <div className="min-h-[800px] flex flex-col items-center justify-center">
      <MdShoppingCart size={80} className="mb-4 text-slate-500" />

      <div className="text-3xl font-bold text-slate-700">
        Your Cart is Empty
      </div>

      <div className="text-lg text-slate-500 mt-2">
        Add some products to get started
      </div>

      {/* Arrow is now visible */}
      <div className="mt-6">
        <Link
          to="/"
          className="flex gap-2 items-center text-blue-500 hover:text-blue-600 transition"
        >
          <MdArrowBack size={24} />
          <span className="font-medium">Start Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default CartEmpty;
