/**
 * @file Sellers - Admin seller list page
 * @description
 * - Uses useSellerFilter hook to fetch and paginate sellers based on URL params
 * - Displays SellerTable when sellers exist, or an empty state message otherwise
 * - Provides an "Add Seller" button that opens Globalmodal with AddSellerForm
 * - Shows Loader during fetch and ErrorPage on failure
 * @usage App.jsx -- route `/admin/sellers` inside AdminLayout
 */
import useSellerFilter from "./useSellerFilter";
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { MdPersonAdd } from 'react-icons/md';
import AddSellerForm from "./AddSellerForm";
import Globalmodal from "../../shared/Globalmodal";
import SellerTable from "./SellerTable";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";

const Sellers = () => {
  const [openModal, setOpenModal] = useState(false);
  const { sellers, pagination } = useSelector((state) => state.seller);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  // Calling the `useSellerFilter` custom hook
  useSellerFilter();

  const emptySellers = !sellers || sellers?.length === 0;

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <React.Fragment>
      <div className="pt-6 pb-10 flex justify-end">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300"
        >
          <MdPersonAdd className="text-xl" />
          Add Seller
        </button>
      </div>

      {!emptySellers && (
        <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">
          All Sellers
        </h1>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {emptySellers ? (
            <div className="flex flex-col items-center justify-center text-gray-600 py-10">
              <h2 className="text-2xl font-semibold">
                No Seller Created Yet
              </h2>
            </div>
          ) : (
            <SellerTable sellers={sellers} pagination={pagination} />
          )}
        </>
      )}

      <Globalmodal open={openModal} setOpen={setOpenModal} title="Add New Seller">
        <AddSellerForm setOpen={setOpenModal} />
      </Globalmodal>
    </React.Fragment>
  );
};

export default Sellers;
