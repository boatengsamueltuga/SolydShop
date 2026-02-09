/**
 * @file Product filter bar — search, category dropdown, sort toggle, and clear button.
 *
 * @description
 * - Search input with 700ms debounce — updates `keyword` URL param.
 * - MUI Select for category filtering — updates `category` URL param.
 * - Sort toggle button — flips `sortby` between "asc" and "desc".
 * - Clear Filters button — resets all URL params.
 * - All filter state is synced bidirectionally with URL search params.
 *
 * @param {Object} props
 * @param {Array}  props.categories — Array of category objects ({categoryId, categoryName}).
 *
 * @usage Products.jsx — rendered above the product grid.
 */
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControl, InputLabel, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp, FiRefreshCcw, FiSearch } from "react-icons/fi";
import Button from "@mui/material/Button";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Filter = ({categories}) => {

  const[searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams)
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() =>{
     const currentCategory = searchParams.get("category") || "all";
     const currentSortOrder = searchParams.get("sortby") || "asc";
     const currentSearchTerm = searchParams.get("keyword") || "";
   //these params above are updated to the states
   setCategory(currentCategory);
   setSortOrder(currentSortOrder);
   setSearchTerm(currentSearchTerm);
    
  },[searchParams]);
    
  useEffect(() => { 
    const handler = setTimeout(() => {
      if(searchTerm){
        searchParams.set("keyword", searchTerm);
      }else{
        searchParams.delete("keyword");
      }
      navigate(`${pathname}?${searchParams.toString()}`);
    }, 700);

    return () =>{
      clearTimeout(handler);
    };
  }, [searchParams, searchTerm, navigate, pathname]);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    if(selectedCategory ===  "all"){
      params.delete("category");
    }else{
      params.set("category", selectedCategory)
    }
    navigate(`${pathname}?${params}`);
      setCategory(event.target.value);
  };

  const toggleSortOrder = () =>{
    setSortOrder((prevOrder) => {
       const newOrder = (prevOrder === "asc") ? "desc" : "asc";
       params.set("sortby", newOrder);
       navigate(`${pathname}?${params}`);
       return newOrder;
    })
  };

  const handleClearFilters = () => {
    navigate({pathname : window.location.pathname});
  }

  return(
    <div className ="flex lg:flex-row flex-col-reverse lg:justify-between justify-center items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex items-center 2xl:w-[450px] sm:w-[420px] width-full">
            <input
           type ="text"
           placeholder="Search Products"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className = "border  border-b-gray-400 text-slate-800 rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-[#1976d2]"/>
           <FiSearch  className="absolute left-3 text-slate-800 size={20}"/> 
        </div>

          {/* Category Select */}
        <div className="flex sm:flex-row flex-col gap-4 items-center">
        <FormControl
        className="text-slate-800 border-slate-700" 
        variant="outlined" size="small">
            <InputLabel id="category-select-label">Category</InputLabel>

            <Select
            labelId="category-select-label"
            value={category}
            onChange={handleCategoryChange}
            label="Category"
            className="min-w-[120px] text-slate-800 border-slate-700"
            >
            <MenuItem value="all">All</MenuItem>
            {categories.map((item) =>(
                <MenuItem key={item.categoryId} value={item.categoryName}>
                    {item.categoryName}
                    </MenuItem>
            )
         
         )}
            </Select>
        </FormControl>
        {/* Sort Button and Clear Filter Button */}
        <Tooltip title={`Sorted by Price: ${sortOrder === "asc" ? "asc" : "desc"}`}>
      <span>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleSortOrder}
              className="flex items-center gap-2 h-10"
            >
              Sort By
              {sortOrder === "asc" ? (
                <FiArrowUp size={20} />
              ) : (
                <FiArrowDown size={20} />
              )}
            </Button>
          </span>
        </Tooltip>
        <button
        className="flex items-center gap-2 bg-rose-900 text-white px-3 py-2 rounded-md transition duration-300 ease-in shadow-md focus:outline-none"
        onClick={handleClearFilters}
        >
         <FiRefreshCcw className="font-semibold" size ={16}/>   
         <span className="font-semibold">Clear Filter</span>
        </button>

        </div>

    </div>
  );
}
export default Filter;