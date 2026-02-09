package com.ecommerce.sb_ecom.controller;

import com.ecommerce.sb_ecom.config.AppConstants;
import com.ecommerce.sb_ecom.payload.*;
import com.ecommerce.sb_ecom.security.services.UserDetailsImpl;
import com.ecommerce.sb_ecom.service.OrderService;
import com.ecommerce.sb_ecom.service.StripeService;
import com.ecommerce.sb_ecom.util.AuthUtil;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Order placement, listing, and status management endpoints.
 *
 * <p>Authenticated users place orders via {@code /api/order/}. Admin and seller
 * roles can list and update order statuses under their respective path prefixes.</p>
 */
@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private AuthUtil authUtil;

    /**
     * Places an order for the authenticated user's cart contents.
     *
     * @param paymentMethod payment method identifier (e.g. "stripe", "cod")
     * @param orderRequestDTO address ID and payment gateway details
     * @return the created order with HTTP 201
     */
    @PostMapping("/order/users/payments/{paymentMethod}")
    public ResponseEntity<OrderDTO> orderProducts(@PathVariable String paymentMethod,
                                                  @RequestBody OrderRequestDTO orderRequestDTO){

        String emailId = authUtil.loggedInEmail();
//        System.out.println("orderRequestDTO DATA: "+ orderRequestDTO);
//        System.out.println("AddressId = " + orderRequestDTO.getAddressId());
        OrderDTO orderDTO = orderService.placeOrder(
                emailId,
                orderRequestDTO.getAddressId(),
                paymentMethod,
                orderRequestDTO.getPgName(),
                orderRequestDTO.getPgPaymentId(),
                orderRequestDTO.getPgStatus(),
                orderRequestDTO.getPgResponseMessage()
        );
       return  new ResponseEntity<>(orderDTO, HttpStatus.CREATED);
    }
    /**
     * Creates a Stripe PaymentIntent and returns its client secret for frontend confirmation.
     */
    @PostMapping("/order/stripe-client-secret")
    public ResponseEntity<String> createStripeClientSecret(@RequestBody StripePaymentDTO stripePaymentDTO) throws StripeException {
        System.out.println("StripePaymentDTO Received " + stripePaymentDTO);
        PaymentIntent paymentIntent = stripeService.paymentIntent(stripePaymentDTO);
        return new ResponseEntity<>(paymentIntent.getClientSecret(), HttpStatus.CREATED);
    }

    /**
     * Returns all orders in the system (paginated). Admin-only.
     */
    @GetMapping("/admin/orders")
    public ResponseEntity<OrderResponse> getAllOrders(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder
    ){
        OrderResponse orderResponse = orderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder);
                return new ResponseEntity<OrderResponse>(orderResponse, HttpStatus.OK);
    }

    /**
     * Returns orders associated with the authenticated seller (paginated). Seller-only.
     */
    @GetMapping("/seller/orders")
    public ResponseEntity<OrderResponse> getAllSellerOrders(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder
    ){
        OrderResponse orderResponse = orderService.getAllSellerOrders(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<OrderResponse>(orderResponse, HttpStatus.OK);
    }

    /**
     * Updates the status of an order. Admin-only.
     */
     @PutMapping("/admin/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId,
                                                      @RequestBody OrderStatusUpdateDTO orderStatusUpdateDTO){
        OrderDTO order = orderService.updateOrder(orderId, orderStatusUpdateDTO.getStatus());
        return new ResponseEntity<OrderDTO>(order, HttpStatus.OK);
     }

    /**
     * Updates the status of an order. Seller-only.
     */
    @PutMapping("/seller/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatusSeller(@PathVariable Long orderId,
                                                      @RequestBody OrderStatusUpdateDTO orderStatusUpdateDTO){
        OrderDTO order = orderService.updateOrder(orderId, orderStatusUpdateDTO.getStatus());
        return new ResponseEntity<OrderDTO>(order, HttpStatus.OK);
    }

}
