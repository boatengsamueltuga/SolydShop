/**
 * @file Product card component — renders a single product tile in grid layouts.
 *
 * @description
 * - Displays product image, truncated name (50 chars), truncated description (80 chars),
 *   price (with special/discounted price if applicable), and an "Add to Cart" button.
 * - Clicking the image or name opens `ProductViewModal` with full product details.
 * - The `about` prop disables the modal and price/cart section (used on the About page).
 * - Dispatches `addToCart` on button click and shows a toast confirmation.
 *
 * @param {Object}  props
 * @param {number}  props.productId    — Unique product identifier.
 * @param {string}  props.productName  — Product display name.
 * @param {string}  props.image        — Product image URL.
 * @param {string}  props.description  — Product description text.
 * @param {number}  props.quantity     — Stock quantity (0 = out of stock).
 * @param {number}  props.price        — Original price.
 * @param {number}  props.discount     — Discount percentage.
 * @param {number}  props.specialPrice — Discounted price (if applicable).
 * @param {boolean} [props.about=false] — When true, hides price/cart and disables modal.
 *
 * @usage Home.jsx, Products.jsx, About.jsx — product grid tiles.
 */
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "../shared/ProductViewModal";
import truncateText from "../../utils/truncateText";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions";
import { toast } from "react-hot-toast";

const ProductCard  = ({
      productId,
      productName,
      image,
      description,
      quantity,
      price,
      discount,
      specialPrice,
      about = false,
}) =>{
    const [openProductViewModal, setOpenProductViewModal] = useState(false);
    const btnLoader = false;
    const [selectedViewProduct, setSelectedViewProduct] = useState("");
    const isAvailable = quantity && Number(quantity) > 0;
    const dispatch = useDispatch();

    const handleProductView = (product) => {
        if(!about){
        setSelectedViewProduct(product);
        setOpenProductViewModal(true);
        }
        
    };
    
    const addToCartHandler = (cartItems) => {
     dispatch(addToCart(cartItems, 1));
     toast.success(`${cartItems.productName} added to cart`);

    }

    return (
        <div className = "border rounded-lg shadow-xl overflow-hidden transition-shadow duration-300">
            <div onClick={() => {
                handleProductView({
                    id: productId,
                    productName,
                    image,
                    description,
                    quantity,
                    price,
                    discount,
                    specialPrice,   
                })
            } } className = "w-full overflow-hidden aspect-[3/2]">
            <img 
            className="w-full h-full cursor-pointer transition-transform duration-300 transform hover:scale-105 "
            src ={image}
            alt={productName}    
            />
            </div>
            <div className = "p-4">
             <h2 onClick = {() => {
                
                handleProductView({
                    id: productId,
                    productName,
                    image,
                    description,
                    quantity,
                    price,
                    discount,
                    specialPrice,   
                })
            
             }}
                className = "text-lg font-semibold mb-2 cursor-pointer">
                {truncateText(productName, 50)}
             </h2>

             <div className = "min-h-20 max-h-20">
                <p className = "text-gray-600 text-sm">
                    {truncateText(description, 80)}</p>
             </div>

             {!about &&(
                <div className = "flex items-center justify-between">
              {specialPrice ? (
             <div className = "flex flex-col">
                <span className = "text-gray-400 line-through">
                   ${Number(price).toFixed(2)}
                </span>
                <span className = "text-xl font-bold text-slate-700">
                   ${Number(specialPrice).toFixed(2)}
                </span>
             </div>
              ): (
             <span className = "text-xl font-bold text-slate-700">
                  {"  "}
                   ${Number(price).toFixed(2)}
                </span>
              )}
              <button
              disabled = {!isAvailable || btnLoader}
              onClick= {() => addToCartHandler({
                productId,
                productName,
                image,
                description,
                quantity,
                price,
                discount,
                specialPrice,
              })}
              className = {`bg-blue-500 ${isAvailable ? "opacity-100 hover:bg-blue-600" : "opacity-70"}
                       text-white py-2 px-3 rounded-lg items-center transition-colors duration-300 w-36 flex justify-center`}>
                        <FaShoppingCart  className="mr-2"/>
                {isAvailable ? "Add to Cart" : "Out of Stock"}
              </button>
             </div>
             )}
            </div>
            <ProductViewModal
            isOpen = {openProductViewModal} 
            setIsOpen ={setOpenProductViewModal}
            product={selectedViewProduct}
            isAvailable = {isAvailable}
            />
        </div>
    )
}

export default ProductCard;

