/**
 * @file Category filter hook — URL-driven data fetching for the admin category panel.
 *
 * Reads `page` from URL search params → builds a 0-indexed query string → dispatches
 * `fetchCategories(queryString)`. Automatically re-fetches when params change.
 *
 * @usage Category.jsx — admin category management DataGrid.
 */
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCategories } from "../store/actions";

const useCategoryFilter = () => {
  const [searchParams] = useSearchParams(); // Access search params from the URL
  const dispatch = useDispatch(); // Get the dispatch function to call actions

  useEffect(() => {
    const params = new URLSearchParams(); // Create new URLSearchParams object

    // Get current page from URL search params, defaulting to 1 if not present
    const currentPage = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    params.set("pageNumber", currentPage - 1); // Pagination starts from 0 for API

    // Convert params to a query string
    const queryString = params.toString();

    // Dispatch action to fetch categories using the constructed query string
    dispatch(fetchCategories(queryString));
  }, [dispatch, searchParams]);
};

export default useCategoryFilter;