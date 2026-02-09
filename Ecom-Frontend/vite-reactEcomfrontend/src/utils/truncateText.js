/**
 * Truncates a string to a given character limit, appending "..." if exceeded.
 * Safely handles null/undefined via optional chaining.
 * @param {string} text - The text to truncate.
 * @param {number} [charLimit=90] - Maximum characters before truncation.
 * @returns {string} Original text if within limit, or truncated with "..." suffix.
 *
 * @usage ProductCard.jsx — truncating product names (50 chars) and descriptions (80 chars).
 *        ItemContent.jsx — truncating cart item names.
 */
 const truncateText = (text, charLimit = 90)=>{
    if(text?.length > charLimit){
        return text.slice(0, charLimit) + "...";
    }
    return text;
}
export default truncateText;