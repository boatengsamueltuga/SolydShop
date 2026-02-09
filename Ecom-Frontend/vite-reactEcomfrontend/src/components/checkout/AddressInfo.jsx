/**
 * @file Address selection step (Checkout step 0) — displays saved addresses with add/edit/delete.
 *
 * @description
 * - If no addresses exist, shows a prompt with "Add Address" button.
 * - Otherwise renders `<AddressList>` with selectable address cards and edit/delete buttons.
 * - "Add More" button opens `<AddressInfoModal>` containing `<AddAddressForm>`.
 * - Delete opens `<DeleteAddressModal>` confirmation dialog.
 *
 * @param {Object} props
 * @param {Array}  props.address — User's saved addresses from the auth Redux slice.
 *
 * @usage Checkout.jsx — rendered at step 0.
 */
import { Skeleton } from '@mui/material';
import React, { useState } from 'react'
import { FaAddressBook } from 'react-icons/fa';
import AddressInfoModal from './AddressInfoModal';
import AddAddressForm from './AddAddressForm';
import { useDispatch, useSelector } from 'react-redux';
import AddressList from '../AddressList';
import { deleteUserAddresses } from '../../store/actions';
import DeleteAddressModal from './DeleteModal';
import toast from 'react-hot-toast';

const AddressInfo = ({ address }) => {
     const [openAddressModal, setOpenAddressModal] = useState(false);
      const [openDeleteModal, setOpenDeleteModal] = useState(false);
     const [selectedAdress, setSelectedAddress] = useState("");

    const addNewAddressHandler = () => {
      setSelectedAddress("");
      setOpenAddressModal(true); 
    };
    
    const dispatch = useDispatch();

    const deleteAddressHandler = () => {
        dispatch(deleteUserAddresses(
            toast,
            selectedAdress?.addressId,
            setOpenDeleteModal,
        ));
        setOpenDeleteModal(false);
    };

    const noAddressExist = !address || address.length === 0;
    const { isLoading, btnLoader} = useSelector((state) => state.errors);
    

  return (
    <div className='pt-4'>
        {noAddressExist ? (
            <div className='p-6 rounded-lg max-w-md mx-auto flex flex-col items-center justify-center'>
              <FaAddressBook size={50} className = 'text-gray-500 mask-b-to-red-400'/>
               <h1 className='mb -2 text-slate-900 text-center font-semibold text-2xl'>
                    No address Added Yet
                </h1>
                <p className='mb-6 text-slate-800 text-center'>
                    Please add your address to complete purchase
                </p>

                <button
                     onClick={addNewAddressHandler}
                     className ='px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all'>
                    Add Address
                </button>
            </div>
        ) : (

            <div className='relative p-6 rounded-lg max-w-md mx-auto'>
                <h1 className='text-slate-800 text-center font-bold text-2xl'>
                    Select Address
                </h1>

                 {isLoading ? (
                 <div className='py-4 px-8'>
                     <Skeleton className = 'bg-amber-100'/>
                 </div>
            ): (
                <>
                <div className='space-y-4 pt-6'>
                {/* <p>Address list here...</p> */}
                <AddressList 
                addresses={address}
                setSelectedAddress={setSelectedAddress}
                setOpenAddressModal={setOpenAddressModal}
                setOpenDeleteModal={setOpenDeleteModal}
                />
         </div>
            {address.length >0 && (
                <div   className='mt-4'>
                    <button
                       onClick={addNewAddressHandler}
                     className ='px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all'>
                    Add More
                    </button>
                </div>
            )}
            </>
            )}
            </div>
           
        )}

        <AddressInfoModal
          open={openAddressModal}
          setOpen={setOpenAddressModal}>
           
           <AddAddressForm 
           address ={selectedAdress}
           setOpenAddressModal={setOpenAddressModal}/>
        </AddressInfoModal>

         <DeleteAddressModal
            open={openDeleteModal}
            loader={btnLoader}
            setOpen={setOpenDeleteModal}
            onDeleteHandler={deleteAddressHandler}
            />
        
    </div>
  )
}

export default AddressInfo