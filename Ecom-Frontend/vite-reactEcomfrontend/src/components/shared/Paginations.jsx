/**
 * @file URL-driven pagination — MUI Pagination component synced with URL search params.
 *
 * @description
 * - Reads `page` from URL search params (defaults to 1).
 * - On page change, updates the `page` param and navigates, preserving other params.
 * - All list views use this as their single pagination control.
 *
 * @param {Object} props
 * @param {number} props.numberOfPage   — Total number of pages.
 * @param {number} props.totalProducts  — Total item count (informational).
 *
 * @usage Products, AdminProducts, Orders, Category, Sellers — below DataGrid/product grids.
 */
import Pagination from '@mui/material/Pagination';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
const Paginations = ({numberOfPage, totalProducts}) =>{
    const [searchParams] = useSearchParams();
    const pathname = useLocation().pathname;
    const params = new URLSearchParams(searchParams);
    const navigate  = useNavigate();
    const paramValue = searchParams.get("page")
                ? Number(searchParams.get("page"))
                :1;
   const onChangeHandler = (event, value) =>{
      params.set("page", value.toString());
      navigate(`${pathname}?${params}`);
   }
    return(
        <Pagination 
        count={numberOfPage} 
        page={paramValue}
        defaultPage={1} 
        siblingCount={0} 
        boundaryCount={2} 
        shape="rounded" 
        onChange ={onChangeHandler}
        />
    )
}
export default Paginations;