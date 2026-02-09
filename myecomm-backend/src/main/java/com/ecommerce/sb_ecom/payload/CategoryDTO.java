package com.ecommerce.sb_ecom.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request/response DTO for category CRUD operations.
 * Used when creating, updating, or returning a single category.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    @Schema(description = "Category ID", example = "101")
    private Long categoryId;
    @Schema(description = "Category name for a category you wish to create", example = "iPhone 17")
    private String categoryName;
}
