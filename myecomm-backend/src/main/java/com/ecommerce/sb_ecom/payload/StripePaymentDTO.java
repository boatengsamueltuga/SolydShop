package com.ecommerce.sb_ecom.payload;

import com.ecommerce.sb_ecom.model.Address;
import lombok.Data;

import java.util.Map;

/**
 * Request body sent by the frontend to {@code POST /api/order/stripe-client-secret}
 * to create a Stripe PaymentIntent. Contains the charge amount, currency,
 * customer details, and optional metadata forwarded to Stripe.
 */
@Data
public class StripePaymentDTO {
    private Long amount;
    private String currency;
    private String email;
    private String name;
    private Address address;
    private String description;
    private Map<String, String > metadata;


}
