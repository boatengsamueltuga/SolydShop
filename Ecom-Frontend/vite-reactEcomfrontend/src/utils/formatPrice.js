/**
 * @file Price formatting utilities used across the storefront, cart, checkout, and admin dashboard.
 */

/**
 * Formats a numeric amount as a USD currency string using Intl.NumberFormat.
 * @param {number} amount - The raw numeric price.
 * @returns {string} Formatted string, e.g. "$1,234.56".
 *
 * @usage Cart.jsx, ItemContent.jsx — displaying unit prices and line totals.
 */
export const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
       style:"currency",
       currency:"USD",
    }).format(amount);
}

// export const formatPriceCalculation = (quantity, price) => {
//     return (Number(quantity) * Number(price)).toFixed(2);

// };

/**
 * Safely calculates quantity * price and returns a fixed 2-decimal string.
 * Returns "0.00" if either input is not a finite number (guards against NaN/undefined).
 * @param {number|string} quantity - Item quantity.
 * @param {number|string} price - Unit price.
 * @returns {string} Calculated total as "0.00" format, e.g. "89.50".
 *
 * @usage OrderSummary.jsx — per-item line total and subtotal display.
 */
export const formatPriceCalculation = (quantity, price) => {
  const q = Number(quantity);
  const p = Number(price);

  if (!Number.isFinite(q) || !Number.isFinite(p)) {
    return "0.00";
  }

  return (q * p).toFixed(2);
};

/**
 * Abbreviates large revenue numbers for the admin dashboard.
 * - >= 1 billion  → "1.2B"
 * - >= 1 million  → "3.4M"
 * - >= 1 thousand → "5.6K"
 * - otherwise     → raw value
 * @param {number} value - The revenue amount.
 * @returns {string|number} Abbreviated string or raw value if < 1000.
 *
 * @usage DashboardOverview.jsx — Total Revenue metric card.
 */
export const formatRevenue = (value) =>{
  if(value >= 1e9){
   return (value / 1e9).toFixed(1) + "B";
  }else if(value >= 1e6){
    return (value / 1e6).toFixed(1) + "M";
  }
  else if(value >= 1e3){
    return (value / 1e3).toFixed(1) + "K";
  }else{
    return value;
  }
}