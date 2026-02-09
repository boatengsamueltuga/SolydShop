package com.ecommerce.sb_ecom.repositories;

import com.ecommerce.sb_ecom.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Data access for {@link Order} entities.
 *
 * <p>{@code getTotalRevenue} — sums {@code totalAmount} across all orders;
 * used by the admin analytics endpoint. Returns 0 when no orders exist.</p>
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    Double getTotalRevenue();

}
