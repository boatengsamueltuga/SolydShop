/**
 * @file Seller reducer — stores the seller list with server-side pagination (admin only).
 *
 * @state {Array|null} sellers    — Current page of seller user objects from the API.
 * @state {Object}     pagination — Pagination metadata (pageNumber, pageSize, totalElements, totalPages, lastPage).
 *
 * @actions GET_SELLERS.
 *
 * @usage Sellers.jsx, SellerTable.jsx — admin seller management panel.
 */
const initialState = {
  sellers: null,
  pagination: {},
};

export const sellerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_SELLERS":
      return {
        ...state,
        sellers: action.payload,
        pagination: {
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