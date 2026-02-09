package com.ecommerce.sb_ecom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * A confirmed purchase created when a user checks out their cart.
 *
 * <p>Lifecycle: an order is created with a date and status, then its status
 * can be updated by admin or seller (e.g. processing, shipped, delivered).</p>
 *
 * <p>Relationships:</p>
 * <ul>
 *   <li>One-to-many with {@link OrderItem} — the line items in this order.</li>
 *   <li>One-to-one with {@link Payment} — this side owns the FK ({@code payment_id}).</li>
 *   <li>Many-to-one with {@link Address} — the shipping address for this order.</li>
 * </ul>
 */
@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"orderItems", "payment", "address"})
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long orderId;

    @Email
    @Column(nullable = false)
    private String email;

    @OneToMany(
            mappedBy = "order",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE}
    )
    private List<OrderItem> orderItems = new ArrayList<>();

    private LocalDate orderDate;

    @OneToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;

    private Double totalAmount;
    private String orderStatus;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;
}
