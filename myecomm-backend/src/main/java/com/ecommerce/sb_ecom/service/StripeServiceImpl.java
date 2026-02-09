package com.ecommerce.sb_ecom.service;

import com.ecommerce.sb_ecom.payload.StripePaymentDTO;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.CustomerSearchResult;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerSearchParams;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import static com.ecommerce.sb_ecom.security.services.UserDetailsImpl.build;

/**
 * Creates Stripe PaymentIntents for order checkout.
 *
 * <p>Business rules:</p>
 * <ul>
 *   <li>The Stripe API key is set once on bean initialization via {@code @PostConstruct}.</li>
 *   <li>Before creating a PaymentIntent, the service searches for an existing
 *       Stripe Customer by email. If none is found, a new Customer is created
 *       with name and address details from the request.</li>
 *   <li>Automatic payment methods are enabled on every PaymentIntent.</li>
 * </ul>
 */
@Service
@Transactional
public class StripeServiceImpl implements StripeService{

    @Value("${stripe.secret.key}")
    private String stripeApiKey;

    //This annotation will be executed after the StripeServiceImpl is created
    @PostConstruct
    public void init(){
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    public PaymentIntent paymentIntent(StripePaymentDTO stripePaymentDTO) throws StripeException {
        Customer customer;
        //Retrieve and check if Customer exist
        CustomerSearchParams searchParams =
                CustomerSearchParams.builder()
                        .setQuery("email:'" + stripePaymentDTO.getEmail() + "'")
                        .build();
        CustomerSearchResult customers = Customer.search(searchParams);
        if(customers.getData().isEmpty()){
            //Create new Customer
            CustomerCreateParams customerParams =
                    CustomerCreateParams.builder()
                            .setName(stripePaymentDTO.getName())
                            .setEmail(stripePaymentDTO.getEmail())
                            .setAddress(
                                    CustomerCreateParams.Address.builder()
                                            .setLine1(stripePaymentDTO.getAddress().getStreet())
                                            .setCity(stripePaymentDTO.getAddress().getCity())
                                            .setState(stripePaymentDTO.getAddress().getState())
                                            .setPostalCode(stripePaymentDTO.getAddress().getZipcode())
                                            .setCountry(stripePaymentDTO.getAddress().getCountry())
                                            .build()
                            )
                            .build();

             customer = Customer.create(customerParams);

        }else{
        //Fetch the Customer that exist
           customer = customers.getData().get(0);

        }
        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount(stripePaymentDTO.getAmount())
                        .setCurrency(stripePaymentDTO.getCurrency())
                        .setCustomer(customer.getId())
                        .setDescription(stripePaymentDTO.getDescription())
                        .setAutomaticPaymentMethods(
                                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                        .setEnabled(true)
                                        .build()
                        )
                        .build();

        return PaymentIntent.create(params);

    }
}
