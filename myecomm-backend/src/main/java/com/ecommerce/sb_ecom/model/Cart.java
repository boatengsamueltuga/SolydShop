package com.ecommerce.sb_ecom.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * A user's shopping cart, holding items before checkout.
 *
 * <p>Lifecycle: a cart is created when items are first added and persists
 * across sessions. On checkout the cart contents are converted into an
 * {@link Order} with corresponding {@link OrderItem}s.</p>
 *
 * <p>Relationships:</p>
 * <ul>
 *   <li>One-to-one with {@link User} — this side owns the FK ({@code user_id}).</li>
 *   <li>One-to-many with {@link CartItem} — removing a cart cascades deletion
 *       of all its items ({@code orphanRemoval = true}).</li>
 * </ul>
 */
@Entity
@Table(name = "carts")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"user", "cartItems"})
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long cartId;

    // Relationship between the Cart and the User
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // One cart can have many items
    @OneToMany(
            mappedBy = "cart",
            cascade = {
                    CascadeType.PERSIST,
                    CascadeType.MERGE,
                    CascadeType.REMOVE
            },
            orphanRemoval = true
    )
    private List<CartItem> cartItems = new ArrayList<>();

    private Double totalPrice = 0.0;
}
