/**
 * @file Centralized Redux action creators — every async/sync action in the application.
 *
 * @description
 * All 26+ action creators live here. Pattern: `(params) => async (dispatch, getState) => { ... }`.
 * UI callbacks (toast, setLoader, reset, navigate, setOpen) are passed directly into actions
 * so side effects are handled at the action level, not in components.
 *
 * Action groups:
 * - Public: fetchProducts, fetchCategories
 * - Cart:   addToCart, increaseCartQuantity, decreaseCartQuantity, removeFromCart, createUserCart, getUserCart
 * - Auth:   authenticateSignInUser, registerNewUser, logOutUser
 * - Address: addUpdateUserAddress, getUserAddresses, selectUserCheckoutAddress, deleteUserAddresses, clearCheckoutAddress
 * - Payment: addPaymentMethod, createStripePaymentSecret, stripePaymentConfirmation
 * - Admin/Seller: analyticsAction, getOrdersForDashboard, updateOrderStatusFromDashboard,
 *   dashboardProductsAction, addNewProductFromDashboard, updateProductFromDashboard,
 *   deleteProduct, updateProductImageFromDashboard
 * - Categories: getAllCategoriesDashboard, createCategoryDashboardAction, updateCategoryDashboardAction, deleteCategoryDashboardAction
 * - Sellers: getAllSellersDashboard, addNewDashboardSeller
 *
 * @usage Dispatched from components via `useDispatch()`. All API calls flow through `api.js`.
 */
import api from "../../api/api";

/* =========================
   FETCH PRODUCTS
========================= */
export const fetchProducts = (queryString) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });

    const { data } = await api.get(`/public/products?${queryString}`);

    dispatch({
      type: "FETCH_PRODUCTS",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });

    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to fetch products",
    });
  }
};

/* =========================
   FETCH CATEGORIES
========================= */
export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "CATEGORY_LOADER" });

    const { data } = await api.get(`/public/categories`);

    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });

    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to fetch categories",
    });
  }
};

/* =========================
   ADD TO CART
   (STORE + UI + LOCALSTORAGE)
========================= */
export const addToCart = (data, qty = 1, toast) =>
  (dispatch, getState) => {

    const { cart } = getState().carts;

    const existingItem = cart.find(
      (item) => item.productId === data.productId
    );

    const newQuantity = existingItem
      ? existingItem.quantity + qty
      : qty;

    // Update Redux Store
    dispatch({
      type: "ADD_CART",
      payload: { ...data, quantity: newQuantity },
    });

    // Update LocalStorage (FULL CART)
    const updatedCart = existingItem
      ? cart.map((item) =>
          item.productId === data.productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      : [...cart, { ...data, quantity: newQuantity }];

    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );
};

/* =========================
   INCREASE CART QUANTITY
   (STORE + UI + LOCALSTORAGE)
========================= */
export const increaseCartQuantity =
  (data, toast, currentQuantity, setCurrentQuantity) =>
  (dispatch, getState) => {

    const { cart } = getState().carts;

    const cartItem = cart.find(
      (item) => item.productId === data.productId
    );

    if (!cartItem) {
      toast.error("Item not found in cart");
      return;
    }

    const newQuantity = cartItem.quantity + 1;

    // Update UI immediately
    setCurrentQuantity(newQuantity);

    // Update Redux Store
    dispatch({
      type: "ADD_CART",
      payload: { ...data, quantity: newQuantity },
    });

    // Update LocalStorage (FULL CART)
    const updatedCart = cart.map((item) =>
      item.productId === data.productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );
};

   //Decrease Quantity
export const decreaseCartQuantity =
  (data, toast, currentQuantity, setCurrentQuantity) =>
  (dispatch, getState) => {

    const { cart } = getState().carts;

    const cartItem = cart.find(
      (item) => item.productId === data.productId
    );

    if (!cartItem) {
      toast.error("Item not found in cart");
      return;
    }

    // Prevent quantity going below 1
    if (cartItem.quantity <= 1) {
      toast.error("Minimum quantity reached");
      return;
    }

    const newQuantity = cartItem.quantity - 1;

    // Update UI immediately
    setCurrentQuantity(newQuantity);

    // Update Redux store
    dispatch({
      type: "ADD_CART",
      payload: { ...data, quantity: newQuantity },
    });

    // Update localStorage (FULL cart snapshot)
    const updatedCart = cart.map((item) =>
      item.productId === data.productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );
};

//Remove Products from cart 
export const removeFromCart = (data, toast) =>
  (dispatch, getState) => {

    const { cart } = getState().carts;

    const updatedCart = cart.filter(
      (item) => item.productId !== data.productId
    );

    // Update Redux
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: updatedCart,
    });

    // Update localStorage
    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

    //
    toast.success(`${data.productName} removed from cart`);
};

//Action for Login
export const authenticateSignInUser
 = (sendData, toast, reset, navigate, setLoader) => async(dispatch) => {
   try{
     setLoader(true);
     const { data } = await api.post("/auth/signin", sendData);
     dispatch({type: "LOGIN_USER", payload:data});
     localStorage.setItem("auth", JSON.stringify(data));
     reset();
     toast.success("Login Success");
     navigate("/");
   }catch(error){
       console.log(error);
       toast.error(error?.response?.data?.message || "Internal Server Error");
   } finally{
    setLoader(false);
   }

  }
   //Action for Register
export const registerNewUser
 = (sendData, toast, reset, navigate, setLoader) => async(dispatch) => {
   try{
     setLoader(true);
     const { data } = await api.post("/auth/signup", sendData);
    //  dispatch({type: "LOGIN_USER", payload:data});
    //  localStorage.setItem("auth", JSON.stringify(data));
     reset();
     toast.success(data?.message || "User Registered Successfully");
     navigate("/login");
   }catch(error){
       console.log(error);
       toast.error(error?.response?.data?.message  || error?.response?.data?.password || "Internal Server Error");
   } finally{
    setLoader(false);
   }
}

//Logout Action
export const logOutUser = (navigate) => (dispatch) => {
      dispatch({ type:"LOG_OUT"});

      localStorage.removeItem("auth");
      navigate("/login");
};

//Add Address Action
export const addUpdateUserAddress =
 (sendData, toast, addressId, setOpenAddressModal ) =>  async (dispatch, getState) => {
  
  //const { user } = getState().auth;
  dispatch({ type:"BUTTON_LOADER"});
    try{
       if(!addressId){
          const { data } = await api.post("/addresses", sendData);
       }else{
           const { data } = await api.put(`/addresses/${addressId}`, sendData);
       }
     dispatch(getUserAddresses());
     toast.success("Address saved successfully");
     dispatch({ type:"IS_SUCCESS"});

   }catch(error){
       console.log(error);
       toast.error(error?.response?.data?.message  || "Internal Server Error");
       dispatch({ type:"IS_ERROR", payload:null});
   } finally{
    setOpenAddressModal(false);
   }  
};
 

export const getUserAddresses = () => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });

    const { data } = await api.get("/addresses");

    dispatch({ type: "USER_ADDRESS", payload: data });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to fetch user addresses",
    });
  }
};

export const selectUserCheckoutAddress = (address) => {
  localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));
 return{
  type: "SELECT_CHECKOUT_ADDRESS",
  payload: address,
 }
};

//Delete Address
export const deleteUserAddresses = (toast, addressId, setOpenDeleteModal) => async (dispatch, getState) => {
  try {
    dispatch({ type: "BUTTON_LOADER" });

    await api.delete(`/addresses/${addressId}`);
     dispatch({ type:"IS_SUCCESS"});
    dispatch(getUserAddresses());
    dispatch(clearCheckoutAddress());
     toast.success("Address deleted successfully");
    
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Some Error Occured",
    });
  } finally{
    setOpenDeleteModal(false);
  }
};

export const clearCheckoutAddress =() => {
  return {
    type: "REMOVE_CHECKOUT_ADDRESS",
  }
};

export const addPaymentMethod = (method) => {
 return{
  type: "ADD_PAYMENT_METHOD",
  payload: method,
 }
};

// Create User Cart
export const createUserCart = (sendCartItems) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    await api.post(`/cart/create`, sendCartItems);
    await dispatch(getUserCart());
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to create cart items",
    });
  }
};

//get User Cart
export const getUserCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "IS_FETCHING" });

    const { data } = await api.get(`/carts/users/cart`);

    dispatch({
      type: "GET_USER_CART_PRODUCTS",
      payload: data.products,
      totalPrice: data.totalPrice,
      cartId: data.cartId,
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().carts.cart)
    );

    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to fetch cart items",
    });
  }
};
// export const getUserCart = () => async (dispatch, getState) => {
//   try {
//     dispatch({ type: "IS_FETCHING" });

//     const { data } = await api.get(`/carts/users/cart`);

//     dispatch({
//       type: "GET_USER_CART_PRODUCTS",
//       payload: data.products,
//       cartId: data.cartId,
//     });

//     localStorage.setItem(
//       "cartItems",
//       JSON.stringify(getState().carts.cart)
//     );

//     dispatch({ type: "IS_SUCCESS" });
//   } catch (error) {
//     dispatch({
//       type: "IS_ERROR",
//       payload:
//         error?.response?.data?.message || "Failed to fetch cart items",
//     });
//   }
// };



export const createStripePaymentSecret
 = (sendData) => async(dispatch, getState) => {
   try{
    dispatch({ type: "IS_FETCHING" });
    
     const { data } = await api.post("/order/stripe-client-secret", sendData);
     dispatch({ type: "CLIENT_SECRET", payload:data });
     localStorage.setItem("client-secret", JSON.stringify(data));
     dispatch({ type: "IS_SUCCESS" });
   }catch(error){
       console.log(error);
       toast.error(error?.response?.data?.message  || "Failed create client secret");
   } ;
};


export const stripePaymentConfirmation
 = (sendData,setErrorMessage, setLoading, toast) => async(dispatch, getState) => {
   try{
    
     const response  = await api.post("/order/users/payments/online", sendData);
     console.log(response);
     if(response.data){
      console.log("IN IF");
      localStorage.removeItem("CHECKOUT_ADDRESS");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("client-secret");
      dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS"});
      dispatch({ type: "CLEAR_CART"});
      toast.success("Order Accepted");
     }else{
      setErrorMessage("Payment Failed. Please try again.");

     }
     
   }catch(error){
       setErrorMessage("Payment Failed. Please try again.");
   } 
   
};

export const analyticsAction
 = () => async(dispatch, getState) => {
   try{
    dispatch({ type: "IS_FETCHING"})
    const { data } = await api.get(`/admin/app/analytics`);
     dispatch({
       type: "FETCH_ANALYTICS",
       payload: data,
     })
     dispatch({type: "IS_SUCCESS"})
   }catch(error){
       dispatch({
          type:"IS_ERROR",
          payload:error?.response?.data?.message || "Failed to fetch analytics data"
       });
   };
  }; 


  export const getOrdersForDashboard = (queryString, isAdmin) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const endpoint = isAdmin ? "/admin/orders" : "/seller/orders";
    const { data } = await api.get(`${endpoint}?${queryString}`);

    dispatch({
      type: "GET_ADMIN_ORDERS",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });

    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to fetch orders data",
    });
  }
};


export const  updateOrderStatusFromDashboard =
 (orderId, orderStatus, toast, setLoader, isAdmin ) =>  async (dispatch, getState) => {
   
    try{
      setLoader(true);
      const endpoint = isAdmin ? "/admin/orders/" : "/seller/orders/";
      const { data } =   await api.put(`${endpoint}${orderId}/status`, {status:orderStatus});
     toast.success(data.message || "Order updated successfully");
     await dispatch(getOrdersForDashboard());
   }catch(error){
       console.log(error);
       toast.error(error?.response?.data?.message  || "Internal Server Error");
   } finally{
    setLoader(false);
   }  
};

export const dashboardProductsAction = (queryString, isAdmin) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const endpoint = isAdmin ? "/admin/products" : "/seller/products";
    const { data } = await api.get(`${endpoint}?${queryString}`);

    dispatch({
      type: "FETCH_PRODUCTS",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      lastPage: data.lastPage,
    });

    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to fetch dashboard products",
    });
  }
};


export const updateProductFromDashboard = 
// (sendData, toast, reset, setLoader, setOpen) => async (dispatch) => {
  (sendData, toast, reset, setLoader, setOpen, isAdmin) => async (dispatch) => {
  try{
    setLoader(true);
    // await api.put(`/admin/products/${sendData.id}`, sendData);
    const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.put(`${endpoint}${sendData.id}`, sendData);
    toast.success("Product update successful");
    reset();
    setLoader(false);
    setOpen(false);
    await dispatch(dashboardProductsAction());
  }catch(error){
   toast.error(error?.response?.data?.description || "Product update failed");
  }
};


// export const deleteProduct = 
// (setLoader, productId, toast, setOpenDeleteModal) => async (dispatch, getState) => {
//   try {
//     setLoader(true)

//     await api.delete(`/admin/products/${productId}`);
//      toast.success("Product deleted successfully");
//      setLoader(false);
//      setOpenModal(false);
//      await dispatch(dashboardProductsAction());
//   } catch (error) {
//     console.log(error);
//     toast.error(
//       error?.response?.data?.message || "Some Error Occured",
//      )
//   } 
// };
// export const deleteProduct =
//   (setLoader, productId, toast, setOpenDeleteModal) =>
//   async (dispatch) => {
//     try {
//       setLoader(true);

//       await api.delete(`/admin/products/${productId}`);

//       toast.success("Product deleted successfully");

//       setOpenDeleteModal(false);

//       await dispatch(dashboardProductsAction());
//     } catch (error) {
//       console.error("Delete product error:", error);

//       toast.error(
//         error?.response?.data?.message || "Some error occurred"
//       );
//     } finally {
//       setLoader(false);
//     }
//   };

export const addNewProductFromDashboard =
 (sendData, toast, reset, setLoader, setOpen, isAdmin) => async(dispatch, getState)=>{
  try{
    setLoader(true);
    const endpoint = isAdmin ? "/admin/categories/" : "/seller/categories/";
    await api.post(`${endpoint}${sendData.categoryId}/product`, sendData);
   toast.success("Product created successfully");
   reset();
   setOpen(false);
   await dispatch(dashboardProductsAction());
  }catch(error){
   console.error(err);
   toast.error(err?.response?.data?.description || "Product creation failed");
  }finally{
    setLoader(false);
  }
 }

export const deleteProduct = 
(setLoader, productId, toast, setOpenDeleteModal, isAdmin) => async (dispatch, getState) => {
    try {
      setLoader(true);

      // await api.delete(`/admin/products/${productId}`);
      const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
      await api.delete(`${endpoint}${productId}`);
      toast.success("Product deleted successfully");

      setLoader(false);
      setOpenDeleteModal(false);

      await dispatch(dashboardProductsAction("pageNumber=0"));

    } catch (error) {
      setLoader(false);
      toast.error(
        error?.response?.data?.message || "Some Error Occurred"
      );
    }
  };



  export const updateProductImageFromDashboard = 
// (formData, productId, toast, setLoader, setOpen) => async (dispatch) => {
 (formData, productId, toast, setLoader, setOpen, isAdmin) => async (dispatch) => {
  try{
    setLoader(true);
    // await api.put(`/admin/products/${productId}/image`, formData);
    const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
    await api.put(`${endpoint}${productId}/image`, formData);
    toast.success("Image upload successful");
    setLoader(false);
    setOpen(false);
    await dispatch(dashboardProductsAction());
  }catch(error){
   toast.error(error?.response?.data?.description || "Product Image upload failed");
  }
};


export const getAllCategoriesDashboard = (queryString) => async (dispatch) => {
  dispatch({ type: "CATEGORY_LOADER" });
  try {
    const { data } = await api.get(`/public/categories?${queryString}`);
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data["content"],
      pageNumber: data["pageNumber"],
      pageSize: data["pageSize"],
      totalElements: data["totalElements"],
      totalPages: data["totalPages"],
      lastPage: data["lastPage"],
    });

    dispatch({ type: "CATEGORY_SUCCESS" });
  } catch (err) {
    console.log(err);

    dispatch({
      type: "IS_ERROR",
      payload: err?.response?.data?.message || "Failed to fetch categories",
    });
  }
};

export const createCategoryDashboardAction =
  (sendData, setOpen, reset, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });
      await api.post("/admin/categories", sendData);
      dispatch({ type: "CATEGORY_SUCCESS" });
      reset();
      toast.success("Category Created Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to create new category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const updateCategoryDashboardAction =
  (sendData, setOpen, categoryID, reset, toast) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.put(`/admin/categories/${categoryID}`, sendData);

      dispatch({ type: "CATEGORY_SUCCESS" });

      reset();
      toast.success("Category Update Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to update category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const deleteCategoryDashboardAction =
  (setOpen, categoryID, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.delete(`/admin/categories/${categoryID}`);

      dispatch({ type: "CATEGORY_SUCCESS" });

      toast.success("Category Delete Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to delete category");
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

  //Sellers Action
  export const getAllSellersDashboard =
  (queryString) => async (dispatch, getState) => {
    const { user } = getState().auth;
    try {
      dispatch({ type: "IS_FETCHING" });
      const { data } = await api.get(`/auth/sellers?${queryString}`);
      dispatch({
        type: "GET_SELLERS",
        payload: data["content"],
        pageNumber: data["pageNumber"],
        pageSize: data["pageSize"],
        totalElements: data["totalElements"],
        totalPages: data["totalPages"],
        lastPage: data["lastPage"],
      });

      dispatch({ type: "IS_SUCCESS" });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Failed to fetch sellers data",
      });
    }
  };

export const addNewDashboardSeller =
  (sendData, toast, reset, setOpen, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      await api.post("/auth/signup", sendData);
      reset();
      toast.success("Seller registered successfully!");

      await dispatch(getAllSellersDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.password ||
          "Internal Server Error"
      );
    } finally {
      setLoader(false);
      setOpen(false);
    }
  };


