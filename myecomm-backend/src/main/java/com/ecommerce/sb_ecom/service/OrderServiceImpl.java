package com.ecommerce.sb_ecom.service;

import com.ecommerce.sb_ecom.model.*;
import com.ecommerce.sb_ecom.payload.OrderDTO;
import com.ecommerce.sb_ecom.payload.OrderItemDTO;
import com.ecommerce.sb_ecom.payload.OrderResponse;
import com.ecommerce.sb_ecom.projectexceptions.APIException;
import com.ecommerce.sb_ecom.projectexceptions.ResourceNotFoundException;
import com.ecommerce.sb_ecom.repositories.*;
import com.ecommerce.sb_ecom.util.AuthUtil;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


/**
 * Implements order placement, listing, and status management.
 *
 * <p>Business rules:</p>
 * <ul>
 *   <li>Placing an order converts the user's cart items into order items,
 *       creates a {@link Payment} record, deducts product stock, and clears
 *       the cart. Rejects empty carts.</li>
 *   <li>The initial order status is set to "Accepted".</li>
 *   <li>Admin listing returns all orders; seller listing filters orders
 *       to those containing at least one product owned by the authenticated seller.</li>
 *   <li>Status updates accept any string value (e.g. "Shipped", "Delivered").</li>
 * </ul>
 */
@Service
public class OrderServiceImpl implements OrderService{
    @Autowired
    CartRepository cartRepository;
    @Autowired
    AddressRepository addressRepository;
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderItemRepository orderItemRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    CartService cartService;
    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AuthUtil authUtil;
    @Override
    @Transactional
    public OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage) {
        //Getting User Cart
        Cart cart = cartRepository.findCartByEmail(emailId);
        if(cart == null){
            throw new ResourceNotFoundException("Cart","email", emailId);
        }
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        //Create a new order with payment info
        Order order = new Order();
        order.setEmail(emailId);
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(cart.getTotalPrice());
        order.setOrderStatus("Accepted");
        order.setAddress(address);



        Payment payment = new Payment(paymentMethod, pgPaymentId, pgStatus, pgResponseMessage, pgName);
        payment.setOrder(order);
        payment = paymentRepository.save(payment);
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        //Get items from the cart into the order items
        List<CartItem> cartItems = cart.getCartItems();
        if(cartItems.isEmpty()){
            throw  new APIException("Cart is Empty");
        }

        //Initializes an empty list that will hold all OrderItem objects.
        List<OrderItem> orderItems = new ArrayList<>();

        //Iterates through each item in the user’s shopping cart.
        //cartItems is a collection (likely List<CartItem>)
        //representing all products currently in the user’s cart
        for(CartItem cartItem : cartItems){
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setDiscount(cartItem.getDiscount());
            orderItem.setOrderedProductPrice(cartItem.getProductPrice());
            orderItem.setOrder(savedOrder);
            orderItems.add(orderItem);

        }
        orderItems  = orderItemRepository.saveAll(orderItems);
        
        //Update product stock
        cart.getCartItems().forEach(item ->{
            int quantity = item.getQuantity();
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() - quantity);
            productRepository.save(product);

            //Clear the cart
            cartService.deleteProductFromCart(cart.getCartId(), item.getProduct().getProductId());
        });

        //Send back the order summary
        OrderDTO orderDTO = modelMapper.map(savedOrder, OrderDTO.class);
        orderItems.forEach(item -> orderDTO.getOrderItems().add(
                modelMapper.map(item, OrderItemDTO.class)));
        orderDTO.setAddressId(addressId);
        return orderDTO;
    }

    @Override
    public OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
    Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Order> pageOrders = orderRepository.findAll(pageDetails);
        List<Order> orders = pageOrders.getContent();

        List<OrderDTO> orderDTOs = orders.stream()
                .map(order ->modelMapper.map(order, OrderDTO.class))
                .toList();
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setContent(orderDTOs);
        orderResponse.setPageNumber(pageOrders.getNumber());
        orderResponse.setPageSize(pageOrders.getSize());
        orderResponse.setTotalElements(pageOrders.getTotalElements());
        orderResponse.setLastPage((pageOrders.isLast()));
        return orderResponse;
    }

    @Override
    public OrderDTO updateOrder(Long orderId, String orderStatusUpdateDTO) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
        order.setOrderStatus(orderStatusUpdateDTO);
        orderRepository.save(order);

        return modelMapper.map(order,OrderDTO.class);
    }

    @Override
    public OrderResponse getAllSellerOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        User seller = authUtil.loggedInUser();


        Page<Order> pageOrders = orderRepository.findAll(pageDetails);
        List<Order> sellerOrders = pageOrders.getContent().stream()
                .filter(order->order.getOrderItems().stream()
                        .anyMatch(orderItem->{
                            var product = orderItem.getProduct();
                            if(product == null || product.getUser() == null){
                                return false;
                            }
                            return product.getUser().getUserId().equals(
                                    seller.getUserId());
                        }))
                .toList();

        List<OrderDTO> orderDTOs = sellerOrders.stream()
                .map(order ->modelMapper.map(order, OrderDTO.class))
                .toList();
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setContent(orderDTOs);
        orderResponse.setPageNumber(pageOrders.getNumber());
        orderResponse.setPageSize(pageOrders.getSize());
        orderResponse.setTotalElements(pageOrders.getTotalElements());
        orderResponse.setLastPage((pageOrders.isLast()));
        return orderResponse;
    }
}
