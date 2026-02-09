package com.ecommerce.sb_ecom.repositories;

import com.ecommerce.sb_ecom.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Data access for {@link Payment} entities. No custom queries — payments
 * are persisted via their parent {@link com.ecommerce.sb_ecom.model.Order} cascade.
 */
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
