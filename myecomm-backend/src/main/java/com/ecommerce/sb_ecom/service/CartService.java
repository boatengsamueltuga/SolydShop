package com.ecommerce.sb_ecom.service;

import com.ecommerce.sb_ecom.payload.CartDTO;
import com.ecommerce.sb_ecom.payload.CartItemDTO;
import jakarta.transaction.Transactional;

import java.util.List;

/**
 * Shopping cart contract: add/remove products, adjust quantities,
 * sync from frontend, and propagate product changes.
 */
public interface CartService {
     CartDTO addProductToCart(Long productId, Integer quantity);

     List<CartDTO> getAllCarts();

     CartDTO getCart(String emailId, Long cartId);

     @Transactional
     CartDTO updateProductQuantityInCart(Long productId, Integer quantity);

     String deleteProductFromCart(Long cartId, Long productId);

    void updateProductInCarts(Long cartId, Long productId);

    String createOrUpdateCartWithitems(List<CartItemDTO> cartItems);
}
