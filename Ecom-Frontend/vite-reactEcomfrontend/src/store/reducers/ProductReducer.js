/**
 * @file Product reducer — manages product listings, categories, and shared pagination.
 *
 * @state {Array}  products   — Current page of product objects from the API.
 * @state {Array}  categories — Category list used for filters and dropdowns.
 * @state {Object} pagination — Shared pagination metadata (pageNumber, pageSize, totalElements, totalPages, lastPage).
 *                               Note: products and categories overwrite the same pagination object.
 *
 * @actions FETCH_PRODUCTS, FETCH_CATEGORIES.
 *
 * @usage Products, Home, AdminProducts, Category, Filter, AddProductsForm.
 */
const initialState ={
    products: [],
    categories: [],
    pagination: {},

};

export const productReducer = (state = initialState, action) =>{
  switch (action.type){
         
    case "FETCH_PRODUCTS":
        return {
          ...state,
          products:action.payload,
          pagination:{
            ...state.pagination,
            pageNumber: action.pageNumber,
            pageSize: action.pageSize,
            totalElements: action.totalElements,
            totalPages: action.totalPages,
            lastPage: action.lastPage,
            
          },
       };
    

       case "FETCH_CATEGORIES":
        return {
          ...state,
          categories:action.payload,
          pagination:{
            ...state.pagination,
            pageNumber: action.pageNumber,
            pageSize: action.pageSize,
            totalElements: action.totalElements,
            totalPages: action.totalPages,
            lastPage: action.lastPage,
            
          },  
       };
    
    default:
    return state;
  }
};