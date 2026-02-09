/**
 * @file OrderTable - MUI DataGrid table for admin orders
 * @description
 * - Renders all orders in an MUI DataGrid using adminOrderTableColumn definitions
 * - Edit button on each row opens a Globalmodal containing UpdateOrderForm
 * - Supports server-side pagination driven by URL search params
 * - Maps raw order data into table-friendly row objects
 * @param {Object} props
 * @param {Array} props.adminOrder - Array of order objects to display
 * @param {Object} props.pagination - Pagination metadata (pageNumber, pageSize, totalElements, etc.)
 * @usage Orders.jsx -- rendered when orders exist
 */
// import React, { useState } from 'react'
// import { DataGrid } from "@mui/x-data-grid";
// import { adminOrderTableColumn } from '../../helper/tableColumn';
// import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";



// const OrderTable = ({ adminOrder, pagination}) => {
// const navigate = useNavigate();
// const [currentPage, setCurrentPage] = useState(
//     pagination?.pageNumber + 1 || 1
//   );
// const [searchParams] = useSearchParams();
// const params = new URLSearchParams(searchParams);
// const pathname = useLocation().pathname
// //console.log(`AdminOrders:`, adminOrder);

// const handlePaginationChange = (paginationModel) => {
//   const page = paginationModel.page + 1;
//   setCurrentPage(page);
//   params.set("page", page.toString());
//   navigate(`${pathname}?${params}`);
// };



// const tableRecords = adminOrder?.map((item) =>{
//   return {
//     id: item.orderId,
//     email: item.email,
//     totalAmount: item.totalAmount,
//     status: item.orderStatus,
//     date:item.orderDate,
//   }
// });



//   return (
//     <div className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
//       All Orders
//       <h1>
//         <DataGrid
//         className='w-full'
//         rows={tableRecords}
//         columns={adminOrderTableColumn}
//         paginationMode='server'
//         rowCount={pagination?.totalElements || 0}
//         initialState={{
//           pagination: {
//             paginationModel: {
//               pageSize: pagination?.pageSize || 10,
//               page: currentPage - 1,
//             },
//           },
//         }}
//         onPaginationModelChange={handlePaginationChange}
//         disableRowSelectionOnclick
//         disableColumnResize
//         pageSizeOptions={[pagination?.pageSize || 10]}
//         pagination
//         paginationOptions={{
//         showFirstButton: true,
//         showLastButton: true,
//         hideNextButton: currentPage === pagination?.totalPages,
//        }}
//       />
//       </h1>

//       </div>
      
//   )
// }

// export default OrderTable


// import React, { useState } from 'react';
// import { DataGrid } from "@mui/x-data-grid";
// import { adminOrderTableColumn } from '../../helper/tableColumn';
// import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// const OrderTable = ({ adminOrder, pagination, setOpen }) => {
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(
//     pagination?.pageNumber + 1 || 1
//   );

//   const [searchParams] = useSearchParams();
//   const params = new URLSearchParams(searchParams);
//   const pathname = useLocation().pathname;

//   const handlePaginationChange = (paginationModel) => {
//     const page = paginationModel.page + 1;
//     setCurrentPage(page);
//     params.set("page", page.toString());
//     navigate(`${pathname}?${params}`);
//   };

//   const tableRecords = adminOrder?.map((item) => ({
//     id: item.orderId,
//     email: item.email,
//     totalAmount: item.totalAmount,
//     status: item.orderStatus,
//     date: item.orderDate,
//   }));

//   // COLUMN FACTORY
//   const columns = adminOrderTableColumn(setOpen);

//   return (
//     <div className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
//       All Orders
//       <h1>
//         <DataGrid
//           className='w-full'
//           rows={tableRecords}
//           columns={columns}
//           paginationMode='server'
//           rowCount={pagination?.totalElements || 0}
//           initialState={{
//             pagination: {
//               paginationModel: {
//                 pageSize: pagination?.pageSize || 10,
//                 page: currentPage - 1,
//               },
//             },
//           }}
//           onPaginationModelChange={handlePaginationChange}
//           disableRowSelectionOnClick
//           disableColumnResize
//           pageSizeOptions={[pagination?.pageSize || 10]}
//           pagination
//           paginationOptions={{
//             showFirstButton: true,
//             showLastButton: true,
//             hideNextButton: currentPage === pagination?.totalPages,
//           }}
//         />
//       </h1>
//     </div>
//   );
// };

// export default OrderTable;


// import React, { useState } from 'react';
// import { DataGrid } from "@mui/x-data-grid";
// import { adminOrderTableColumn } from '../../helper/tableColumn';
// import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// import Globalmodal from '../../shared/Globalmodal';
// import UpdateOrderForm from '../UpdateOrderForm';

// const OrderTable = ({ adminOrder, pagination }) => {
//   const[updateOpenModal, setUpdateOpenModal] = useState(false);
//   const[selectedtItem, setSelectedItem] = useState("");
//   const navigate = useNavigate();

//   // MODAL STATE (NOW HERE)
//   const [open, setOpen] = useState(false);

//   const [currentPage, setCurrentPage] = useState(
//     pagination?.pageNumber + 1 || 1
//   );

//   const [searchParams] = useSearchParams();
//   const params = new URLSearchParams(searchParams);
//   const pathname = useLocation().pathname;

//   const handlePaginationChange = (paginationModel) => {
//     const page = paginationModel.page + 1;
//     setCurrentPage(page);
//     params.set("page", page.toString());
//     navigate(`${pathname}?${params}`);
//   };

//   const tableRecords = adminOrder?.map((item) => ({
//     id: item.orderId,
//     email: item.email,
//     totalAmount: item.totalAmount,
//     status: item.orderStatus,
//     date: item.orderDate,
//   }));

//   // PASS setOpen INTO COLUMN FACTORY
//   const columns = adminOrderTableColumn(setOpen);

//   return (
//     <div className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
//       All Orders

//       <h1>
        // <DataGrid
        //   className='w-full'
        //   rows={tableRecords}
        //   columns={columns}
        //   paginationMode='server'
        //   rowCount={pagination?.totalElements || 0}
        //   initialState={{
        //     pagination: {
        //       paginationModel: {
        //         pageSize: pagination?.pageSize || 10,
        //         page: currentPage - 1,
        //       },
        //     },
        //   }}
        //   onPaginationModelChange={handlePaginationChange}
        //   disableRowSelectionOnClick
        //   disableColumnResize
        //   pageSizeOptions={[pagination?.pageSize || 10]}
        //   pagination
        //   paginationOptions={{
        //     showFirstButton: true,
        //     showLastButton: true,
        //     hideNextButton: currentPage === pagination?.totalPages,
        //   }}
        // />
//       </h1>

//       {/* GLOBAL MODAL RENDERED HERE */}
//       <Globalmodal
//         open={open}
//         setOpen={setOpen}
//         title="Update Order Status" 
//       >
//         <UpdateOrderForm 
//         set/>
//       </Globalmodal>
//     </div>
//   );
// };

// export default OrderTable;
import React, { useState } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { adminOrderTableColumn } from '../../helper/tableColumn';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Globalmodal from '../../shared/Globalmodal';
import UpdateOrderForm from '../UpdateOrderForm';

const OrderTable = ({ adminOrder, pagination }) => {
  


  const [updateOpenModal, setUpdateOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [loader, setLoader] = useState(false);

  const handleEdit = (order) => {
    setSelectedItem(order);
    setUpdateOpenModal(true);
  };

  const [currentPage, setCurrentPage] = useState(
    pagination?.pageNumber + 1 || 1
  );
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = useLocation().pathname;

  const handlePaginationChange = (paginationModel) => {
    const page = paginationModel.page + 1;
    setCurrentPage(page);
    params.set("page", page.toString());
    navigate(`${pathname}?${params}`);
  };

  const tableRecords = adminOrder?.map((item) => ({
    id: item.orderId,
    email: item.email,
    totalAmount: item.totalAmount,
    status: item.orderStatus,
    date: item.orderDate,
    raw: item,
  }));

  // PASS handleEdit INTO COLUMNS
  const columns = adminOrderTableColumn(handleEdit);

  return (
    <div className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
      All Orders

      <h1>
        <DataGrid
          className='w-full'
          rows={tableRecords}
          columns={columns}
          paginationMode='server'
          rowCount={pagination?.totalElements || 0}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: pagination?.pageSize || 10,
                page: currentPage - 1,
              },
            },
          }}
          onPaginationModelChange={handlePaginationChange}
          disableRowSelectionOnClick
          disableColumnResize
          pageSizeOptions={[pagination?.pageSize || 10]}
          pagination
        />
      </h1>

      {/* MODAL */}
      <Globalmodal
        open={updateOpenModal}
        setOpen={setUpdateOpenModal}
        title="Update Order Status"
      >
      <UpdateOrderForm
        open={updateOpenModal} 
        setOpen={setUpdateOpenModal}
        loader={loader}
        setLoader={setLoader}
        selectedId={selectedItem.id}
        selectedItem={selectedItem}
      />

      </Globalmodal>
    </div>
  );
};

export default OrderTable;

