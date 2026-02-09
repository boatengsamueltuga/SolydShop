/**
 * @file Order filter hook — URL-driven data fetching for the admin/seller order panel.
 *
 * Reads `page` from URL search params → builds a 0-indexed query string → dispatches
 * `getOrdersForDashboard(queryString, isAdmin)`. Automatically re-fetches when params change.
 *
 * @usage Orders.jsx — admin/seller order management page.
 */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getOrdersForDashboard } from "../store/actions";

const useOrderFilter = () => {
const [searchParams] = useSearchParams();
const dispatch = useDispatch();

const { user } = useSelector((state) => state.auth);
const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

useEffect(() => {
    const params = new URLSearchParams();
    
    //Pagination
    const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    :1;
    
    params.set("pageNumber", currentPage -1);

    // const sortOrder = searchParams.get("sortby") || "asc";
    // const categoryParams = searchParams.get("category") || null;
    // const keyword = searchParams.get("keyword") || null;
    // params.set("sortBy", "price");
    // params.set("sortOrder", sortOrder);

    // if(categoryParams){
    //     params.set("category", categoryParams);
    // }

    // if(keyword){
    //     params.set("keyword", keyword);
    // }
    const queryString = params.toString();
    console.log("QUERY STRING", queryString);
    dispatch(getOrdersForDashboard(queryString, isAdmin));

}, [dispatch, searchParams]);

};

export default useOrderFilter;