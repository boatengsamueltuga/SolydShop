package com.ecommerce.sb_ecom.repositories;

import com.ecommerce.sb_ecom.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Data access for {@link Cart} entities.
 *
 * <p>Custom queries:</p>
 * <ul>
 *   <li>{@code findCartByEmail} — resolves a user's cart by their email address.</li>
 *   <li>{@code findCartByEmailAndCartId} — verifies cart ownership by matching both email and cart ID.</li>
 *   <li>{@code findByProductsId} — eagerly fetches all carts containing a given product;
 *       used to update carts when a product is modified or deleted.</li>
 * </ul>
 */
public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query("SELECT c FROM Cart c WHERE c.user.email = ?1")
    Cart findCartByEmail(String email);

    @Query("SELECT c FROM Cart c WHERE c.user.email = ?1 AND c.id = ?2")
    Cart findCartByEmailAndCartId(String emailId, Long cartId);

    @Query("SELECT c FROM Cart c JOIN FETCH c.cartItems ci JOIN FETCH ci.product p WHERE p.id = ?1" )
    List<Cart> findByProductsId(Long productId);

}
