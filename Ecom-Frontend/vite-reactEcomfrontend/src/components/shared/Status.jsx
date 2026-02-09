/**
 * @file Status pill badge — small colored label with an icon (e.g. "In Stock", "Out-Of-Stock").
 *
 * @param {Object}   props
 * @param {string}   props.text  — Badge label text.
 * @param {Component} props.icon — React icon component (rendered as `<Icon>`).
 * @param {string}   props.bg    — Tailwind background class (e.g. "bg-teal-200").
 * @param {string}   props.color — Tailwind text color class (e.g. "text-teal-900").
 *
 * @usage ProductViewModal — stock availability indicator.
 */
const Status = ({text, icon:Icon, bg, color}) => {
    return (
        <div 
        className = {`${bg} ${color} px-2 font-medium rounded flex items-center gap-1`}>
            {text} <Icon  size = {15}/>
        </div>
    )
}

export default Status;