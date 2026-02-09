/**
 * @file Inline button spinner — small SVG loading indicator for form submit buttons.
 *
 * @description
 * - Renders a 20×20px animated circular spinner using the `--color-custom-blue` CSS variable.
 * - Displayed inside buttons while `btnLoader` is true to indicate an async action in progress.
 *
 * @usage AddAddressForm, AddProductsForm, AddCategoryForm, AddSellerForm — inside submit buttons.
 */
import React from 'react'

export const Spinners = () => {
  return (
   <div role="status">
  <svg
  className="w-5 h-5 animate-spin text-[var(--color-custom-blue)]"
  viewBox="0 0 24 24"
  fill="none"
>
  <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="2"
  />
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6h-2z"
  />
</svg>

</div>

  )
}

export default Spinners;