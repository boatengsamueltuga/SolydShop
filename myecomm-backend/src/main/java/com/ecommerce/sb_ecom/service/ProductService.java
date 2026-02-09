package com.ecommerce.sb_ecom.service;

import com.ecommerce.sb_ecom.payload.ProductDTO;
import com.ecommerce.sb_ecom.payload.ProductResponse;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

/**
 * Product lifecycle contract: creation, listing (with filters), search,
 * update, deletion, and image upload.
 *
 * <p>Listing methods are overloaded — a simple paginated version and a
 * filtered version that accepts optional keyword and category name.
 * Admin and seller each have dedicated list methods scoped to their data.</p>
 */
public interface ProductService {

    ProductDTO addProduct(Long categoryId, ProductDTO productDTO);

    ProductResponse getAllProducts(Integer pageNumber,
                                   Integer pageSize,
                                   String sortBy,
                                   String sortOrder);

    ProductResponse getAllProducts(Integer pageNumber,
                                   Integer pageSize,
                                   String sortBy,
                                   String sortOrder,
                                   String keyword,
                                   String category);

    ProductResponse searchByCategory(Long categoryId);
    ProductResponse searchByCategory(Long categoryId, int page, int size, String sortBy, String sortDir);

    ProductResponse searchProductByKeyword(String keyword);
    ProductResponse searchProductByKeyword(String keyword, int page, int size, String sortBy, String sortDir);

    ProductDTO updateProduct(Long productId, ProductDTO product);
    ProductDTO deleteProduct(Long productId);
    ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;

    ProductResponse getAllProductsForAdmin(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse getAllProductsForSeller(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
}

