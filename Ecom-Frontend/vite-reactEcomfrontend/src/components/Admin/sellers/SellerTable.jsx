/**
 * @file SellerTable - MUI DataGrid table for sellers
 * @description
 * - Renders all sellers in an MUI DataGrid using sellerTableColumns (read-only, no action buttons)
 * - Displays columns: ID, username, and email
 * - Supports server-side pagination driven by URL search params
 * @param {Object} props
 * @param {Array} props.sellers - Array of seller objects to display
 * @param {Object} props.pagination - Pagination metadata (pageNumber, pageSize, totalElements, etc.)
 * @usage Sellers.jsx -- rendered when sellers exist
 */
import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { sellerTableColumns } from "../../helper/tableColumn";

const SellerTable = ({ sellers, pagination }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pathname = useLocation().pathname;
  const params = new URLSearchParams(searchParams);
  const [currentPage, setCurrentPage] = useState(pagination?.pageNumber || 1);

  const tableRecords = sellers?.map((item) => {
    return {
      id: item.userId,
      username: item.username,
      email: item.email,
    };
  });

  const handlePaginationChange = (paginationModel) => {
    const page = paginationModel.page + 1;
    setCurrentPage(page);

    params.set("page", page.toString());
    navigate(`${pathname}?${params}`);
  };

  return (
    <div>
      <div className="max-w-fit mx-auto">
        <DataGrid
          className="w-full"
          rows={tableRecords}
          paginationMode="server"
          rowCount={pagination?.totalElements || 0}
          columns={sellerTableColumns}
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
          pagination
          pageSizeOptions={[pagination?.pageSize || 10]}
          paginationOptions={{
            showFirstButton: true,
            showLastButton: true,
            hideNextButton: currentPage === pagination?.totalPages,
          }}
        />
      </div>
    </div>
  );
};

export default SellerTable;