package com.ecommerce.sb_ecom.controller;

import com.ecommerce.sb_ecom.model.Cart;
import com.ecommerce.sb_ecom.payload.CartDTO;
import com.ecommerce.sb_ecom.payload.CartItemDTO;
import com.ecommerce.sb_ecom.repositories.CartRepository;
import com.ecommerce.sb_ecom.service.CartService;
import com.ecommerce.sb_ecom.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Shopping cart endpoints for the authenticated user.
 *
 * <p>Supports creating/syncing a cart, adding and removing products,
 * and adjusting item quantities.</p>
 */
@RestController
@RequestMapping("/api")
public class CartController {


    @Autowired
    private com.ecommerce.sb_ecom.service.CartService cartService;

    @Autowired
    CartRepository cartRepository;

    @Autowired
    AuthUtil authUtil;

    /**
     * Creates or replaces the authenticated user's cart with the given items.
     *
     * @param cartItems list of product IDs and quantities
     * @return confirmation message with HTTP 201
     */
    @PostMapping("/cart/create")
    public ResponseEntity<String> createOrUpdateCart(@RequestBody List<CartItemDTO> cartItems){
       String response = cartService.createOrUpdateCartWithitems(cartItems);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Adds a product to the authenticated user's cart with the specified quantity.
     */
    @PostMapping("/carts/products/{productId}/quantity/{quantity}")
    public ResponseEntity<CartDTO> addProductToCart(@PathVariable Long productId,
                                                    @PathVariable Integer quantity){
        CartDTO cartDTO = cartService.addProductToCart(productId, quantity);
        return new ResponseEntity<>(cartDTO, HttpStatus.CREATED);
    }
    /**
     * Returns all carts in the system. Returns HTTP 302.
     */
    @GetMapping("carts")
    public ResponseEntity<List<CartDTO>> getCarts(){
        List<CartDTO> cartDTOs = cartService.getAllCarts();
        return  new ResponseEntity<List<CartDTO>>(cartDTOs, HttpStatus.FOUND);
    }

    /**
     * Returns the cart belonging to the currently authenticated user.
     */
    @GetMapping("/carts/users/cart")
    public ResponseEntity<CartDTO> getCartById(){
        String emailId = authUtil.loggedInEmail();
        Cart cart = cartRepository.findCartByEmail(emailId);
        Long cartId = cart.getCartId();
        CartDTO cartDTO = cartService.getCart(emailId, cartId);
     return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
    }

    /**
     * Increments or decrements a product's quantity in the cart.
     *
     * @param productId product to adjust
     * @param operation "delete" to decrement by 1, any other value to increment by 1
     */
    @PutMapping("/cart/products/{productId}/quantity/{operation}")
    public ResponseEntity<CartDTO> updateCartProduct(@PathVariable Long productId,
                                                     @PathVariable String operation){
        CartDTO  cartDTO = cartService.updateProductQuantityInCart(productId, operation.equalsIgnoreCase("delete") ? -1 : 1);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
    }

    /**
     * Removes a product entirely from the specified cart.
     */
     @DeleteMapping("/carts/{cartId}/product/{productId}")
    public ResponseEntity<String> deleteProductFromCart(@PathVariable Long cartId,
                                                        @PathVariable Long productId){
       String status = cartService.deleteProductFromCart(cartId, productId);
       return new ResponseEntity<String>(status, HttpStatus.OK);
     }
}
