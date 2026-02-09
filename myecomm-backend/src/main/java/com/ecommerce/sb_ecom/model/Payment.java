package com.ecommerce.sb_ecom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Records payment details for a completed order.
 *
 * <p>One-to-one with {@link Order} — the order owns the relationship.
 * The {@code pg*} fields capture the payment gateway response
 * (e.g. Stripe transaction ID, status, and message).</p>
 */
@Entity
@Table(name = "payments")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"order"})
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long paymentId;

    @OneToOne(
            mappedBy = "payment",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE}
    )
    private Order order;

    @NotBlank
    @Size(min = 4, message = "Payment method must contain at least 4 characters")
    private String paymentMethod;

    private String pgPaymentId;
    private String pgStatus;
    private String pgResponseMessage;
    private String pgName;

    public Payment(
            String paymentMethod,
            String pgPaymentId,
            String pgStatus,
            String pgResponseMessage,
            String pgName
    ) {
        this.paymentMethod = paymentMethod;
        this.pgPaymentId = pgPaymentId;
        this.pgStatus = pgStatus;
        this.pgResponseMessage = pgResponseMessage;
        this.pgName = pgName;
    }
}
