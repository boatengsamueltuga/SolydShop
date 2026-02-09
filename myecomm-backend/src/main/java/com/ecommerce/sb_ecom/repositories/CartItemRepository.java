package com.ecommerce.sb_ecom.repositories;

import com.ecommerce.sb_ecom.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

/**
 * Data access for {@link CartItem} entities.
 *
 * <p>Custom queries:</p>
 * <ul>
 *   <li>{@code findCartItemByProductIdAndCartId} — locates a specific item in a cart
 *       to check existence or update quantity.</li>
 *   <li>{@code deleteCartItemByProductIdAndCartId} — removes a single product from a cart.</li>
 *   <li>{@code deleteAllByCartId} — clears all items from a cart (e.g. after checkout).</li>
 * </ul>
 */
public interface CartItemRepository extends JpaRepository<CartItem,Long> {
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id =?1 AND ci.product.id =?2")
    CartItem findCartItemByProductIdAndCartId(Long cartId, Long productId);

    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cart.id = ?1 AND ci.product.id = ?2")
    void deleteCartItemByProductIdAndCartId(Long cartId, Long productId);

    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cart.id = ?1" )
    void deleteAllByCartId(Long cartId);
}
