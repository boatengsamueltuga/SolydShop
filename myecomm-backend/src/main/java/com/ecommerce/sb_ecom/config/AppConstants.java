package com.ecommerce.sb_ecom.config;

/**
 * Application-wide default values for pagination and sorting.
 *
 * <p>These constants are used as default {@code @RequestParam} values
 * in controller methods so callers can omit query parameters.</p>
 */
public class AppConstants {

    // Default pagination
    public static final String PAGE_NUMBER = "0";
    public static final String PAGE_SIZE   = "10";

    // Sorting defaults for categories
    public static final String SORT_CATEGORIES_BY = "categoryId";
    public static final String SORT_DIR           = "asc";

    // Sorting defaults for products
    public static final String SORT_PRODUCTS_BY  = "productId";
    public static final String SORT_PRODUCTS_DIR = "desc";

    // Sorting defaults for orders and users
    public static final String SORT_ORDERS_BY  = "totalAmount";
    public static final String SORT_USERS_BY  = "userId";

}
