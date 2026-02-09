/**
 * @file Address form — 6-field react-hook-form for adding or editing a shipping address.
 *
 * @description
 * - Fields: Building Name, City, State, ZipCode, Street, Country (all required).
 * - Dual-mode: "Add Address" when no `address.addressId`, "Update Address" when editing.
 * - On edit, pre-fills fields via `setValue` in a `useEffect`.
 * - Dispatches `addUpdateUserAddress` (POST for new, PUT for existing) on submit.
 *
 * @param {Object}   props
 * @param {Object}   props.address             — Existing address to edit (empty string for new).
 * @param {Function} props.setOpenAddressModal  — Callback to close the parent modal.
 *
 * @usage AddressInfo.jsx — rendered inside AddressInfoModal.
 */
import { useDispatch, useSelector } from "react-redux";
import InputField from '../shared/InputField';
import { AiOutlineLogin } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FaAddressCard } from "react-icons/fa";
import Spinners from "../shared/Spinners";
import { addUpdateUserAddress } from "../../store/actions";
import  toast  from "react-hot-toast";
import { useEffect } from "react";

const AddAddressForm = ({ address, setOpenAddressModal}) => {
  const dispatch = useDispatch();
const { btnLoader } = useSelector((state) => state.errors);
 const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {errors},

    }  = useForm({
        mode: "onTouched", 
    });

 const onSaveAddressHandler = async (data) => {
      dispatch(addUpdateUserAddress(
        data,
        toast,
        address?.addressId,
        setOpenAddressModal

      ));
      
  };
    


useEffect(() => {
  if (address?.addressId) {
    setValue("buildingName", address?.buildingName);
    setValue("city", address?.city);
    setValue("street", address?.street);
    setValue("state", address?.state);
    setValue("zipcode", address?.zipcode);
    setValue("country", address?.country);
  }
}, [address]);


  return (
     <div className="">
           <form
            onSubmit={handleSubmit(onSaveAddressHandler)}
            className="">

            <div className="flex justify-center items-center mb-4 font-semibold text-2xl text-slate-800 py-2 px-4">
             <FaAddressCard  className="mr-2 text-2xl"/>
            {!address?.addressId ?
             "Add Address" :
             "Update Address"
            }
            
            </div>
      
       <div className="flex flex-col gap-4">
        {/* BuildingName */}
         <InputField 
         label="Building Name"
         required
         id="buildingName"
         type="text"
         message="*Building Name is required"
         placeholder = "Enter your Building Name"
         register={register}
         errors={errors}
         />
      {/* City */}
          <InputField 
         label="City"
         required
         id="city"
         type="text"
         message="*City is required"
         placeholder = "Enter your City"
         register={register}
         errors={errors}
         />

          {/* State */}
          <InputField 
         label="State"
         required
         id="state"
         type="text"
         message="*State is required"
         placeholder = "Enter your State"
         register={register}
         errors={errors}
         />

           {/*  */}
          <InputField 
         label="ZipCode"
         required
         id="zipcode"
         type="text"
         message="*Zipcode is required"
         placeholder = "Enter your Zipcode"
         register={register}
         errors={errors}
         />

           {/* State */}
          <InputField 
         label="Street"
         required
         id="street"
         type="text"
         message="*Street is required"
         placeholder = "Enter your Street"
         register={register}
         errors={errors}
         />

           {/* State */}
          <InputField 
         label="Country"
         required
         id="country"
         type="text"
         message="*Country is required"
         placeholder = "Enter your Country"
         register={register}
         errors={errors}
         />
       </div>
           <button
           disabled={btnLoader}
           className="text-white bg-custom-blue px-4 py-2 rounded-md mt-4"
           type="submit">
           {btnLoader ? (
            <> 
            <Spinners /> Loading...
            </>
           ) : (
             <>Save</>
           )}
           

           </button>
           </form>
        </div>
  ); 
}

export default AddAddressForm