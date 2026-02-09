/**
 * @file AddProductsForm - Dual-mode product form (add/update)
 * @description
 * - Uses react-hook-form to manage fields: name, description, price, specialPrice, discount, quantity
 * - In add mode, also renders a category selector (SelectTextField) and dispatches addNewProductFromDashboard
 * - In update mode, pre-fills fields from the product prop and dispatches updateProductFromDashboard
 * - Shows Spinners on the submit button while saving, with Cancel/Save action buttons
 * @param {Object} props
 * @param {Object} [props.product] - Product object for edit mode (null for add mode)
 * @param {boolean} [props.update=false] - Whether the form is in update mode
 * @param {Function} props.setOpen - Callback to close the parent modal
 * @usage AdminProducts.jsx -- rendered inside Globalmodal for add/edit product
 */
import React, { useEffect, useState } from 'react'
import InputField from '../../shared/InputField';
import { useForm } from "react-hook-form";
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addNewProductFromDashboard, fetchCategories, updateProductFromDashboard } from '../../../store/actions';
import Spinners from '../../shared/Spinners';
import SelectTextField from '../../shared/SelectTextField';
import SkeletonFullPage from '../../shared/Skeleton';
import ErrorPage from '../../shared/ErrorPage';


const AddProductsForm = ({ setOpen, product, update=false}) => {
const [loader, setLoader] = useState(false);
const [selectedCategory, setSelectedCategory] = useState(null);
const { categories } = useSelector((state) => state.products);
const { categoryLoader, errorMessage } = useSelector((state) => state.errors);
const { user } = useSelector((state) => state.auth);
const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState:{ errors }
    } = useForm({
        mode: "onTouched"
    });
    const saveproductHandler = (data) =>{
        if(!update){
         //create new product logic
         const sendData = {
                ...data,
                categoryId:selectedCategory.categoryId,
            };
         dispatch(addNewProductFromDashboard(
            sendData, toast, reset, setLoader, setOpen, isAdmin
         ));
        }else{
            const sendData = {
                ...data,
                id:product.id,
            };
            //dispatch(updateProductFromDashboard(sendData, toast, reset, setLoader, setOpen));
                       dispatch(updateProductFromDashboard(sendData, toast, reset, setLoader, setOpen, isAdmin));
        }
    };
   useEffect(() =>{
    if(update && product){
        setValue("productName", product?.productName);
        setValue("price", product?.price);
        setValue("quantity", product?.quantity);
        setValue("discount", product?.discount);
        setValue("specialPrice", product?.specialPrice);
        setValue("description", product?.description);
    }
   }, [update, product]);
  //console.log("FORM VALUES", product);

  useEffect(() => {
    if(!update){
        dispatch(fetchCategories());
    }
  }, [dispatch, update]);

  useEffect(() => {
    if(!categoryLoader && categories?.length > 0){
        setSelectedCategory(categories[0]);
    }
  }, [categories,categoryLoader]);

  if(categoryLoader) return <SkeletonFullPage />
  if(errorMessage) return <ErrorPage message={errorMessage} />

  return (
    <div className='py-5 relative h-full'>
       <form className='space-y-4'
       onSubmit={handleSubmit(saveproductHandler)}>
        
           <div className='flex md:flex-row flex-col gap-4 w-full'>
               <InputField
                 label="Product Name"
                 required
                 id="productName"
                 type="text"
                 message="This field is required*"
                 placeholder="Product Name"
                 register={register}
                 errors={errors}
                />
            {!update && (
               <SelectTextField 
                label="Select Categories"
                select={selectedCategory}
                setSelect={setSelectedCategory}
                lists={categories}
               /> 
            )}
           </div>

           <div className='flex md:flex-row flex-col gap-4 w-full'>
               <InputField
                 label="Price"
                 required
                 id="price"
                 type="number"
                 message="This field is required*"
                 placeholder="Product Price"
                 register={register}
                 errors={errors}
                />

               <InputField
                 label="Qunatity"
                 required
                 id="quantity"
                 type="number"
                 message="This field is required*"
                 placeholder="Product Quantity"
                 register={register}
                 errors={errors}
                />
           
           </div>
           

           <div className='flex md:flex-row flex-col gap-4 w-full'>
                    <InputField
                        label="Discount"
                        id="discount"
                        type="number"
                        placeholder="Discount Amount"
                        register={register}
                        errors={errors}
                    />

                    <InputField
                        label="Special Price"
                        id="specialPrice"
                        type="number"
                        placeholder="Discount Price"
                        register={register}
                        errors={errors}
                    />
                    </div>

              <div className="flex flex-col gap-2 w-full">
                    <label
                        htmlFor="description"
                        className="font-semibold text-sm text-slate-800"
                    >
                        Description
                    </label>

                    <textarea
                        rows={5}
                        placeholder="Add product description..."
                        className={`w-full px-4 py-2 border outline-none bg-transparent 
                        text-slate-800 font-semibold rounded-md
                        ${errors["description"]?.message ? "border-red-500" : "border-slate-700"}
                        `}
                        maxLength={255}
                        {...register("description", {
                        required: { value: true, message: "Description is required" },
                        })}
                    />
 
                   
                  {/* Error */}
                    {errors["description"]?.message && (
                        <p className="text-sm font-semibold text-red-600">
                        {errors["description"]?.message}
                        </p>
                    )}

                 <div className='flex w-full justify-between items-center absolute bottom-14'>
                    <Button disabled={loader}
                    onClick={() => setOpen(false)}
                    variant='outlined'
                    className='text-white py-[10px] px-4 text-sm font-medium' >
                        Cancel
                    </Button>
                    <Button 
                    disabled={loader}
                    type='submit'
                    variant='contained'
                    color='primary'
                    className='bg-custom-blue text-white py-[-10px] px-4 text-sm font-medium'>
                    { loader ? (
                        <div className='flex gap-2 items-center'>
                            <Spinners /> Loading...
                        </div>
                    ):(

                "Save"
               )}
            </Button>
           </div>
            </div>
               
       </form>

       
    </div>
    
  )
}

export default AddProductsForm