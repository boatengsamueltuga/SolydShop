/**
 * @file Order reducer — stores admin/seller order list with server-side pagination.
 *
 * @state {Array|null} adminOrder — Current page of order objects from the API.
 * @state {Object}     pagination — Pagination metadata (pageNumber, pageSize, totalElements, totalPages, lastPage).
 *
 * @actions GET_ADMIN_ORDERS.
 *
 * @usage Orders.jsx, OrderTable.jsx — admin/seller order management panel.
 */
const initialState = {
    adminOrder: null,
    pagination: {},
};

export const orderReducer = (state = initialState, action) =>{
    switch (action.type){
        case "GET_ADMIN_ORDERS":
            return{
                ...state,
                adminOrder: action.payload,
                pagination:{
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements:action.totalElements,
                    totalPages:action.totalPages,
                    lastPage:action.lastPage,
                },
            };
            default:
                return state;
    }
    
}