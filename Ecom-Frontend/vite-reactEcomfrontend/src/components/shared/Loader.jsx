/**
 * @file Full-page loading spinner — displays a centered RotatingLines animation with optional text.
 *
 * @param {Object} props
 * @param {string} [props.text] — Loading message (defaults to "Please wait......").
 *
 * @usage Products, Home, Cart, Checkout, admin panels — shown while `isLoading` is true.
 */
import { RotatingLines } from "react-loader-spinner";

const Loader =({text}) =>{
    return(
        <div className="flex justify-center item-center w-full h-[450px]">
            <div className ="flex flex-col items-center gap-1">
        <RotatingLines
               visible={true}
               height="36"
               width="36"
               color="#16a34a"
               strokeWidth="5"
               animationDuration="0.75"
               ariaLabel="rotating-lines-loading"
               wrapperStyle={{}}
               wrapperClass=""
                /> 
                <p className="text-slate-800">
                    {text ? text: "Please wait......"}
                </p>
                </div>
            </div>
    )
}

export default Loader;