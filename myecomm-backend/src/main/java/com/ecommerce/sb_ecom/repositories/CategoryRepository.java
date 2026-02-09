package com.ecommerce.sb_ecom.repositories;

import com.ecommerce.sb_ecom.model.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Data access for {@link Category} entities.
 *
 * <p>{@code findByCategoryName} — looks up a category by its exact name;
 * used to check for duplicates before creating a new category.</p>
 */
public interface CategoryRepository extends JpaRepository<Category, Long> {
     Category findByCategoryName(@NotBlank @Size(min = 5, message = "Category must contain at least 5 Characters" ) String categoryName);
}
