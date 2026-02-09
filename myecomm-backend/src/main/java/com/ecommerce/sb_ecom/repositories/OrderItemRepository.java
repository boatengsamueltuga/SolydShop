package com.ecommerce.sb_ecom.repositories;

import com.ecommerce.sb_ecom.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Data access for {@link OrderItem} entities. No custom queries — line items
 * are persisted and retrieved via their parent {@link com.ecommerce.sb_ecom.model.Order} cascade.
 */
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
