/**
 * @file Quantity selector — stateless +/- button pair for adjusting cart item quantity.
 *
 * @param {Object}   props
 * @param {number}   props.quantity          — Current quantity to display.
 * @param {boolean}  props.cardCounter       — When true, hides the "QUANTITY" label (cart row mode).
 * @param {Function} props.handleQtyIncrease — Called when "+" is clicked.
 * @param {Function} props.handleQtyDecrease — Called when "-" is clicked.
 *
 * @usage ItemContent.jsx — quantity controls in each cart row.
 */
const btnStyles = "border-[1.2px] border-slate-800 px-3 py-1 rounded";
const SetQuantity = ({
    quantity,
    cardCounter,
    handleQtyIncrease,
    handleQtyDecrease,
}) => {
    return(
        <div className="flex gap-8 items-center">
        {cardCounter ? null : <div className = "font-semibold">QUANTITY</div>}
        <div className="flex md:flex-row flex-col gap-4 items-center lg:text-[22px] text-sm">
           {/* Decrease */}
          <button
          // disabled={quantity<=1}
            className={btnStyles}
            onClick={handleQtyDecrease}>
            -
          </button>
          <div className="text-slate-500">{quantity}</div>
         {/* Increase */}
          <button
          // disabled={quantity<=1}
            className={btnStyles}
            onClick={handleQtyIncrease}>
            +
          </button>
        </div>
    </div>
    );
};
export default SetQuantity;