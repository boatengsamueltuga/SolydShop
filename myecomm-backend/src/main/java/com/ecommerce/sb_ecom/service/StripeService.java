package com.ecommerce.sb_ecom.service;

import com.ecommerce.sb_ecom.payload.StripePaymentDTO;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.stereotype.Service;


/**
 * Stripe payment integration contract.
 */
public interface StripeService {
    PaymentIntent paymentIntent(StripePaymentDTO stripePaymentDTO) throws StripeException;
}
