package com.ecommerce.sb_ecom.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * A single product entry within a {@link Cart}, tracking the chosen quantity
 * and the current price/discount at the time the item was added.
 *
 * <p>Relationships:</p>
 * <ul>
 *   <li>Many-to-one with {@link Cart} — owning side of the cart relationship.</li>
 *   <li>Many-to-one with {@link Product} — the product being held in the cart.</li>
 * </ul>
 */
@Entity
@Table(name = "cart_items")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"cart", "product"})
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long cartItemId;

    // Owning side of the relationship with cart
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
    private double discount;
    private double productPrice;
}
