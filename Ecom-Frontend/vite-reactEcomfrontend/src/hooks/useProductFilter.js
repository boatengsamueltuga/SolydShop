/**
 * @file Product filter hooks — URL-driven data fetching for storefront and admin product views.
 *
 * Exports two hooks:
 * - `useProductFilter`          — Public storefront: reads page, sortby, category, keyword from URL → fetchProducts.
 * - `useDashboardProductFilter` — Admin/Seller panel: reads page from URL → dashboardProductsAction (role-aware).
 *
 * Both hooks treat URL search params as the single source of truth.
 * Re-fetches automatically whenever searchParams change.
 */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { dashboardProductsAction, fetchProducts } from "../store/actions";

/**
 * Reads page, sortby, category, keyword from URL search params → dispatches fetchProducts.
 * @usage Products.jsx — public product listing page.
 */
export const useProductFilter = () => {
const [searchParams] = useSearchParams();
const dispatch = useDispatch();


useEffect(() => {
    const params = new URLSearchParams();
    
    //Pagination
    const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    :1;
    
    params.set("pageNumber", currentPage -1);

    const sortOrder = searchParams.get("sortby") || "asc";
    const categoryParams = searchParams.get("category") || null;
    const keyword = searchParams.get("keyword") || null;
    params.set("sortBy", "price");
    params.set("sortOrder", sortOrder);

    if(categoryParams){
        params.set("category", categoryParams);
    }

    if(keyword){
        params.set("keyword", keyword);
    }
    const queryString = params.toString();
    console.log("QUERY STRING", queryString);
    dispatch(fetchProducts(queryString));

}, [dispatch, searchParams]);

};


/**
 * Reads page from URL search params → dispatches dashboardProductsAction with isAdmin flag.
 * @usage AdminProducts.jsx — admin/seller product management DataGrid.
 */
export const useDashboardProductFilter = () => {
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
    dispatch(dashboardProductsAction(queryString, isAdmin));

}, [dispatch, searchParams]);

};

