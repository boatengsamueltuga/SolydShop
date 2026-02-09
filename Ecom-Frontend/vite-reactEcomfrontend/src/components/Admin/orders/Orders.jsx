/**
 * @file Orders - Admin orders page
 * @description
 * - Uses useOrderFilter hook to fetch and paginate orders based on URL params
 * - Displays an empty state with shopping cart icon when no orders exist
 * - Renders OrderTable with the fetched adminOrder data and pagination
 * - Includes a Globalmodal shell for order-related modal content
 * @usage App.jsx -- route `/admin/orders` inside AdminLayout
 */
// import React, { useState } from 'react'
// import { FaShoppingCart } from "react-icons/fa";
// import OrderTable from './OrderTable';
// import { useSelector } from 'react-redux';
// import useOrderFilter from '../../../hooks/useOrderFilter';
// import { Modal } from '@mui/material';
// import Globalmodal from '../../shared/Globalmodal';



// const Orders = () => {
//   // const  adminOrder = [{ "orderId": 21, "email": "user1@example.com", "orderItems": [ { "orderItemId": 29, "product": { "productId": 152, "productName": "Brown Sugar Loaf Bread", "image": "692bf884-9b14-40b7-9584-40141fb4dabd.png", "description": "Soft brown sugar loaf bread with a rich taste, perfect for breakfast, snacks, and sandwiches.", "quantity": 37, "price": 380.0, "discount": 12.0, "specialPrice": 334.4 }, "quantity": 2, "discount": 12.0, "orderedProductPrice": 334.4 } ], "orderDate": "2026-01-13", "payment": { "paymentId": 21, "paymentMethod": "online", "pgPaymentId": "pi_3SpM3hRnhf3kkRqo1adpFFF5", "pgStatus": "Succeeded", "pgResponseMessage": "Payment successful", "pgName": "Stripe" }, "totalAmount": 668.8, "orderStatus": "Order Accepted !", "addressId": 23 }];
//   // const pagination = { pageNumber: 0, pageSize: 50, totalElements: 14, totalPages: null, lastPage: true }
//   const [open, setOpen] = useState(false);

//   const {adminOrder, pagination} = useSelector((state) => state.order);

//   useOrderFilter();

//   const emptyOrder = !adminOrder || adminOrder?.length === 0;
//   return (
//     <div className='pb-6 pt-20'>
//       {emptyOrder ? (
//         <div className='flex flex-col items-center justify-center text-gray-600 py-10'> 
//       <FaShoppingCart size={50} className='mb-3'/>
//       <h2 className='text-black text-2xl font-semibold'>No orders Placed Yet</h2>
//         </div>
//       ) : (
//         <OrderTable adminOrder={adminOrder} pagination={pagination}/>
//       )}
//     </div>
//   )
// }

// export default Orders


import React, { useState } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import OrderTable from './OrderTable';
import { useSelector } from 'react-redux';
import useOrderFilter from '../../../hooks/useOrderFilter';
import Globalmodal from '../../shared/Globalmodal';

const Orders = () => {
const { adminOrder, pagination } = useSelector((state) => state.order);

  
  const [open, setOpen] = useState(false);

  useOrderFilter();

  const emptyOrder = !adminOrder || adminOrder?.length === 0;

  return (
    <div className='pb-6 pt-20'>
      {emptyOrder ? (
        <div className='flex flex-col items-center justify-center text-gray-600 py-10'> 
          <FaShoppingCart size={50} className='mb-3'/>
          <h2 className='text-black text-2xl font-semibold'>
            No orders Placed Yet
          </h2>
        </div>
      ) : (
        <OrderTable
          adminOrder={adminOrder}
          pagination={pagination}
          setOpen={setOpen}   //PASS DOWN
        />
      )}

      {/* MODAL */}
      <Globalmodal open={open} setOpen={setOpen}>
        {/* modal content later */}
      </Globalmodal>
    </div>
  );
};

export default Orders;
