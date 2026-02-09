package com.ecommerce.sb_ecom.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * A single line item within an {@link Order}, snapshotting the product price
 * and discount at the time of purchase.
 *
 * <p>Relationships:</p>
 * <ul>
 *   <li>Many-to-one with {@link Order} — the parent order.</li>
 *   <li>Many-to-one with {@link Product} — the purchased product.</li>
 * </ul>
 */
@Entity
@Table(name = "order_items")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"product", "order"})
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long orderItemId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private Integer quantity;
    private double discount;
    private double orderedProductPrice;
}
