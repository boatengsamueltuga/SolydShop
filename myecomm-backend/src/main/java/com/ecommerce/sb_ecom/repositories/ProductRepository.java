package com.ecommerce.sb_ecom.repositories;

import com.ecommerce.sb_ecom.model.Category;
import com.ecommerce.sb_ecom.model.Product;
import com.ecommerce.sb_ecom.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Data access for {@link Product} entities. Also implements
 * {@code JpaSpecificationExecutor} to support dynamic filter criteria
 * (keyword + category combination) built at runtime.
 *
 * <p>Custom queries:</p>
 * <ul>
 *   <li>{@code findByCategory} — paginated products filtered by category.</li>
 *   <li>{@code findByProductNameContainingIgnoreCase} — case-insensitive keyword search on product name.</li>
 *   <li>{@code findByUser} — paginated products owned by a specific seller.</li>
 * </ul>
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Page<Product> findByCategory(Category category, Pageable pageable);

    Page<Product> findByProductNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<Product> findByUser(User user, Pageable pageDetails);
}
