package com.ecommerce.sb_ecom.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO used by {@code POST /api/cart/create} to sync the frontend
 * cart with the backend. Each item specifies a product ID and desired quantity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {

    private Long productId;
    private Integer quantity;

}
