package com.ecommerce.sb_ecom.repositories;

import com.ecommerce.sb_ecom.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Data access for {@link Address} entities. No custom queries — addresses
 * are loaded by ID or through the owning {@link com.ecommerce.sb_ecom.model.User} relationship.
 */
public interface AddressRepository extends JpaRepository<Address, Long> {
}
