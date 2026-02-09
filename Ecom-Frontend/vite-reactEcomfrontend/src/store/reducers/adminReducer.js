/**
 * @file Admin reducer — stores dashboard analytics data.
 *
 * @state {Object} analytics — Aggregated metrics (totalProducts, totalOrders, totalRevenue)
 *                              fetched from `/admin/app/analytics`.
 *
 * @actions FETCH_ANALYTICS.
 *
 * @usage Dashboard.jsx — reads analytics for the three overview metric cards.
 */
const initialState ={
    analytics: {},

};

export  const  adminReducer = (state = initialState, action) =>{
    switch(action.type){
        case"FETCH_ANALYTICS":
        return{
            ...state,
            analytics: action.payload
        };

        default: 
        return state;
    }
}

