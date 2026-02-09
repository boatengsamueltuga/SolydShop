package com.ecommerce.sb_ecom.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents an authorization role stored in the {@code roles} table.
 *
 * <p>Each role maps to an {@link AppRole} enum value (e.g. ROLE_USER, ROLE_SELLER, ROLE_ADMIN).
 * Roles are assigned to users via the {@code user_role} join table and are
 * auto-created on application startup if they do not already exist.</p>
 */
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    @EqualsAndHashCode.Include
    private Integer roleId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, name = "role_name")
    private AppRole roleName;

    public Role(AppRole roleName) {
        this.roleName = roleName;
    }
}
