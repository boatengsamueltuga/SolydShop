/**
 * @file AdminProducts - Admin product management page
 * @description
 * - Displays all products in an MUI DataGrid with edit, delete, image upload, and view actions
 * - Uses useDashboardProductFilter hook for server-side pagination via URL params
 * - Provides add/edit product forms via Globalmodal and AddProductsForm
 * - Supports image upload via ImageUploadForm modal and product deletion via DeleteModal
 * - Shows Loader during fetch and empty state when no products exist
 * @usage App.jsx -- route `/admin/products` inside AdminLayout
 */
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa';
import { MdAddShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { adminProductTableColumn } from '../../helper/tableColumn';
//import { useDashboardProductFilter } from '../../../hooks/useProductFilter';
import Loader from '../../shared/Loader';
import Modal from '@mui/material/Modal';
import Globalmodal from '../../shared/Globalmodal';
import AddProductsForm from './AddProductsForm';
import DeleteModal from '../../shared/DeleteModal';
import { deleteProduct } from '../../../store/actions';
import toast from 'react-hot-toast';
import ImageUploadForm from '../../products/ImageUploadForm';
import ProductViewModal from '../../shared/ProductViewModal';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDashboardProductFilter } from '../../../hooks/useProductFilter';


const AdminProducts = () => {
   //These commented section were used for hardcoding
  // const products = [{ "productId": 1, "productName": "SolidMan Updated", "image": "http://localhost:8080/images/c5d53bfd-79bc-47f5-a926-f783fc52865b.png", "description": "I have peace in my marriage in Jesus Mighty Name", "quantity": 89, "price": 5000.0, "discount": 100.0, "specialPrice": 4500.0 }];
  // const pagination = { pageNumber: 0, pageSize: 50, totalElements: 14, totalPages: null, lastPage: true };
  
  const {products, pagination} = useSelector((state) =>state.products);

  const {isLoading, errorMessage} = useSelector((state) => state.errors);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
  const emptyProduct = !products || products?.length === 0;
  const [currentPage, setCurrentPage] = useState(
      pagination?.pageNumber + 1 || 1
    );
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openImageUploadModal, setopenImageUploadModal] = useState(false);
  const [openProductViewModal, setOpenProductViewModal] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = useLocation().pathname;

  const dispatch = useDispatch();
  useDashboardProductFilter();

  const handleEdit = (product)=>{
    setSelectedProduct(product);
    setOpenUpdateModal(true);
  };

  const handleDelete = (product)=>{
    setSelectedProduct(product);
    setOpenDeleteModal(true);
    console.log(`product ${product.id}`);
  };
  const handleImageUpload = (product)=>{
     setSelectedProduct(product);
    setopenImageUploadModal(true);
  };
  const handleProductView = (product)=>{
    setSelectedProduct(product);
    setOpenProductViewModal(true);
  };

   const handlePaginationChange = (paginationModel)=>{
    const page = paginationModel.page + 1;
    setCurrentPage(page);
    params.set("page", page.toString());
    navigate(`${pathname}?${params}`);
  };

   const onDeleteHandler = ()=>{
     //dispatch(deleteProduct(setLoader, selectedProduct?.id, toast, setOpenDeleteModal));
       dispatch(deleteProduct(setLoader, selectedProduct?.id, toast, setOpenDeleteModal, isAdmin));
     console.log(`product ${selectedProduct}`);
  };
  

  const tableRecords = products?.map((item) => ({
    id: item.productId,
    productName: item.productName,
    description: item.description,
    discount: item.discount,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    specialPrice: item.specialPrice,
  }));

  return (
    <div>
      <div className='pt-6 pb-10 flex justify-end'>
        <button
        onClick={()=> setOpenAddModal(true)} 
        className='bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover: text-slate-300 duration-300'>
          <MdAddShoppingCart className = 'text-xl'/>
          Add Product
        </button>
      </div>

      {!emptyProduct && (
        <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
          All Products</h1>
      )}
      {isLoading ? (
        <Loader />
      ):(
      <>
      {emptyProduct ? (
        <div className='flex flex-col items-center justify-center text-gray-600 py-10'>
          <FaBoxOpen size={50} className='mb-3' />
          <h2 className='text-2xl font-semibold'>
            No products created yet
          </h2> 
        </div>
      ):(
        <div className='max-w-full'>
          <DataGrid
                    className='w-full'
                    rows={tableRecords}
                    columns={adminProductTableColumn(
                      handleEdit,
                      handleDelete,
                      handleImageUpload,
                      handleProductView
                    )}
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
                    paginationOptions={{
                      showFirstButton: true,
                      showLastButton: true,
                      hideNextButton: currentPage === pagination?.totalPages,
                    }}
                  />
        </div>
      )}
      </>
      )}
       <Globalmodal 
       open={openUpdateModal || openAddModal}
       setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
       title={openUpdateModal ? "Update Product" : "Add Product"}>
       <AddProductsForm
        setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
        product={selectedProduct}
        update={openUpdateModal}
      />
       </Globalmodal>


       <Globalmodal 
       open={openImageUploadModal}
       setOpen={setopenImageUploadModal}
       title="Add Product Image">
       <ImageUploadForm
        //key={selectedProduct?.productId}
        setOpen={setopenImageUploadModal}
        product={selectedProduct}
      />
       </Globalmodal>

       <DeleteModal 
       open={openDeleteModal}
       setOpen={setOpenDeleteModal}
       loader={loader}
       title="Delete Product"
       onDeleteHandler={onDeleteHandler}>
       
       </DeleteModal>

       <ProductViewModal
       isOpen={openProductViewModal} 
       setIsOpen={setOpenProductViewModal}
       product={selectedProduct}/>
    </div>
  )
}

export default AdminProducts