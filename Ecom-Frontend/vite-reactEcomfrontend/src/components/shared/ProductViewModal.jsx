/**
 * @file Product detail modal — centered HeadlessUI Dialog showing full product information.
 *
 * @description
 * - Displays product image, full name, price (with special price), stock status (via Status pill),
 *   full description, and a Close button.
 * - Uses HeadlessUI `Dialog` with a dark backdrop overlay.
 *
 * @param {Object}  props
 * @param {boolean} props.isOpen      — Controls dialog visibility.
 * @param {Function} props.setIsOpen  — Callback to close the dialog.
 * @param {Object}  props.product     — Product data ({id, productName, image, description, quantity, price, discount, specialPrice}).
 * @param {boolean} props.isAvailable — Whether the product is in stock.
 *
 * @usage ProductCard.jsx — triggered by clicking product image or name.
 */
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Divider } from '@mui/material';
import { MdClose, MdDone } from "react-icons/md";

import { useState } from 'react'
import Status from './Status';

function ProductViewModal({ isOpen, setIsOpen, product, isAvailable }) {

  const {
    id,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
  } = product || {};   // prevents immediate crash

  return (
    <>


      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}>
          
        <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            
           <DialogPanel
  transition
  className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all md:max-w-[620px] md:min-w-[620px] w-full"
>

  {image && (
    <div className="flex justify-center aspect-[3/2] overflow-hidden">
      <img
        src={image}
        alt={productName}
        className="w-full h-full object-cover"
      />
    </div>
  )}

  <div className="px-6 pt-10 pb-2">
    <DialogTitle
      as="h1"
      className="lg:text-3xl sm:text-2xl text-xl font-semibold leading-6 text-gray-800 mb-4"
    >
      {productName}
    </DialogTitle>
  </div>

  {/*FIX: add px-6 only */}
  <div className="px-6 flex items-center justify-between">
    {specialPrice ? (
      <div className="flex flex-col">
        <span className="text-gray-400 line-through">
          ${Number(price).toFixed(2)}
        </span>
        <span className="text-xl font-bold text-slate-700">
          ${Number(specialPrice).toFixed(2)}
        </span>
      </div>
    ) : (
      <span className="text-xl font-bold text-slate-700">
        ${Number(price).toFixed(2)}
      </span>
    )}

    {isAvailable ? (
      
      <Status
        text="In Stock"
        icon={MdDone}
        bg="bg-teal-200"
        color="text-teal-900"
      />
    ) : (
      
      <Status
        text="Out-Of-Stock"
        icon={MdClose}
        bg="bg-rose-200"
        color="text-rose-700"
      />
    )}
  </div>

  <Divider />

  {/* FIX: wrap description with padding */}
  <div className="px-6 pb-6">
    <p>{description}</p>
  </div>
  <div className="flex gap-4 px-6 pb-6 pt-4">
 <div className="flex justify-end px-6 pb-4">
  <div className="px-6 pb-6 flex justify-end">
  <button
  onClick={() => setIsOpen(false)}
  className="
    absolute bottom-4 right-4
    inline-flex items-center gap-1.5
    rounded-md
    bg-slate-100
    px-3 py-1.5
    text-xs font-medium text-slate-700
    transition-colors
    hover:bg-slate-200
    focus:outline-none focus:ring-2 focus:ring-slate-300
  "
>
  Close
</button>

</div>

</div>


</div>


</DialogPanel>


          </div>
        </div>
      </Dialog>
    </>
  )
}

export default ProductViewModal;
