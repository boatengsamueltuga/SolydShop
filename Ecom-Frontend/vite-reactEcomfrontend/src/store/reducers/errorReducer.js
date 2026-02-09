/**
 * @file Error/loading reducer — global loading spinners, error messages, and button loaders.
 *
 * @state {boolean}     isLoading      — Full-page loading state (drives Loader/Skeleton).
 * @state {string|null} errorMessage   — Global error message (drives ErrorPage display).
 * @state {boolean}     categoryLoader — Separate loader for category-specific fetches.
 * @state {string|null} categoryError  — Category-specific error message.
 * @state {boolean}     btnLoader      — Inline button spinner (drives Spinners component).
 *
 * @actions IS_FETCHING, IS_SUCCESS, IS_ERROR, BUTTON_LOADER, CATEGORY_LOADER, CATEGORY_SUCCESS.
 *
 * @usage Every component that fetches data reads from this slice for loading/error states.
 */
const initialState = {
    isLoading: false,
    errorMessage:null,
    categoryLoader:false,
    categoryError: null,
    btnLoader:false,
};

export const errorReducer =(state = initialState, action) => {
  switch (action.type){
    case "IS_FETCHING" :
        return{
            ...state,
            isLoading:true,
            errorMessage:null,
        };

        case "BUTTON_LOADER" :
        return{
            ...state,
            btnLoader:true,
            errorMessage:null,
        };
    case "IS_SUCCESS" :
          return{
             ...state,
            isLoading:false,
            errorMessage:null,
            btnLoader:false,
            categoryError: null,
            categoryLoader:false,
          };
    case "IS_ERROR" :
    return{
         ...state,
            isLoading:false,
            errorMessage:action.payload,
            btnLoader:false,
            categoryLoader:false,
    };

    case "CATEGORY_SUCCESS" :
          return{
             ...state,
            categoryLoader:false,
            errorMessage:null,
            
          };
    case "CATEGORY_LOADER" :
    return{
         ...state,
            categoryLoader:true,
            errorMessage:null,
    }
    default:
      return state;
  }   
};
