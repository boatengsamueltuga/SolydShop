/**
 * @file Cart item row — single product line in the cart with image, price, quantity controls, and total.
 *
 * @description
 * - Displays truncated product name, image, unit price (formatted), quantity +/- controls, and line total.
 * - "Remove" button dispatches `removeFromCart` and shows a toast.
 * - Quantity buttons dispatch `increaseCartQuantity`/`decreaseCartQuantity` which update Redux + localStorage.
 *
 * @param {Object} props — Spread product data: productId, productName, image, description,
 *                          quantity, price, discount, specialPrice, cartId.
 *
 * @usage Cart.jsx — mapped over each cart item.
 */
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import SetQuantity from "./SetQuantity";
import { useDispatch } from "react-redux";
import {
  increaseCartQuantity,
  decreaseCartQuantity,
} from "../../store/actions";
import { toast } from "react-hot-toast";
import { removeFromCart } from "../../store/actions";
import { formatPrice } from "../../utils/formatPrice";
import truncateText from "../../utils/truncateText";

const ItemContent = ({
  productId,
  productName,
  image,
  description,
  quantity,
  price,
  discount,
  specialPrice,
  cartId,
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const dispatch = useDispatch();

  const cartItemPayload = {
    image,
    productName,
    description,
    specialPrice,
    price,
    productId,
    quantity,
  };

  const handleQtyIncrease = () => {
    dispatch(
      increaseCartQuantity(
        cartItemPayload,
        toast,
        currentQuantity,
        setCurrentQuantity
      )
    );
  };

  const handleQtyDecrease = () => {
    dispatch(
      decreaseCartQuantity(
        cartItemPayload,
        toast,
        currentQuantity,
        setCurrentQuantity
      )
    );
  };

  const handleRemoveItem = () => {
  dispatch(removeFromCart({ productId, productName }, toast));

};

  return (
    <div className="grid md:grid-cols-5 grid-cols-4 md:text-md text-sm gap-4 items-center border-[1px] border-slate-200 rounded-md lg:px-4 py-4 p-2">
      <div className="md:col-span-2 justify-self-start flex flex-col gap-2">
        <div className="flex md:flex-row flex-col lg:gap-4 sm:gap-3 gap-0 items-start">
          <h3 className="lg:text-[17px] text-sm font-semibold text-slate-600">
            {truncateText(productName)}
          </h3>
        </div>

        <div className="md:w-36 sm:w-24 w-12">
          <img
            src={image}
            alt={productName}
            className="md:h-36 sm:h-24 h-12 w-full object-cover rounded-md"
          />

          <div className="flex items-start gap-5 mt-3">
            <button
              onClick={handleRemoveItem}
              className="flex items-center semi-bold space-x-2 px-4 py-1 text-xs border border-rose-600 text-rose-600 rounded-md hover:bg-red-50 transition-colors duration-300"
            >
              <HiOutlineTrash size={15} className="text-rose-600" />
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="justify-self-center lg:text-[17px] text-sm text-slate-600 font-semibold">
        {formatPrice(Number(specialPrice))}
      </div>

      <div className="justify-self-center">
        <SetQuantity
          quantity={currentQuantity}
          cardCounter={true}
          handleQtyIncrease={handleQtyIncrease}
          handleQtyDecrease={handleQtyDecrease}
        />
      </div>

      <div className="justify-self-center">
      {formatPrice(Number(currentQuantity) * Number(specialPrice))}
     </div>

    </div>
  );
};

export default ItemContent;
