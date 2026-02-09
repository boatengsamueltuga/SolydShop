package com.ecommerce.sb_ecom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * A purchasable item listed in the store.
 *
 * <p>Pricing follows a base-price / discount / special-price model where
 * {@code specialPrice = price - (price * discount / 100)}.</p>
 *
 * <p>Relationships:</p>
 * <ul>
 *   <li>Many-to-one with {@link Category} — every product belongs to exactly one category.</li>
 *   <li>Many-to-one with {@link User} (seller) — the user who listed the product.</li>
 *   <li>One-to-many with {@link CartItem} — tracks which carts contain this product.</li>
 * </ul>
 */
@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"category", "user", "products"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private Long productId;

    @NotBlank
    @Size(min = 3, message = "Product name must contain atleast 3 characters")
    private String productName;

    private String image;

    @Size(min = 3, message = "Product description must contain atleast 6 characters")
    private String description;

    private Integer quantity;
    private double price;        // 100
    private double discount;     // 25
    private double specialPrice; // 75

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User user;

    @OneToMany(
            mappedBy = "product",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true
    )
    private List<CartItem> products = new ArrayList<>();
}
