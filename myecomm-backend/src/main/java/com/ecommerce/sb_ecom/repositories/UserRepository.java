package com.ecommerce.sb_ecom.repositories;

import com.ecommerce.sb_ecom.model.AppRole;
import com.ecommerce.sb_ecom.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Data access for {@link User} entities.
 *
 * <p>Custom queries:</p>
 * <ul>
 *   <li>{@code findByUserName} — used by Spring Security to load a user during authentication.</li>
 *   <li>{@code existsByUserName / existsByEmail} — uniqueness checks during registration.</li>
 *   <li>{@code findByRole} — paginated lookup joining the {@code user_role} table;
 *       used to list all sellers on the admin/seller endpoints.</li>
 * </ul>
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
   Optional<User> findByUserName(String username);

   Boolean existsByUserName(String username);

   Boolean existsByEmail(String email);

   @Query("SELECT u FROM User u JOIN u.roles r WHERE r.roleName = :role")
    Page<User> findByRole(@Param("role")AppRole appRole, Pageable pageable);
}
