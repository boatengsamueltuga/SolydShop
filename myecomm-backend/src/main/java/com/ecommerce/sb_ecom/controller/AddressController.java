package com.ecommerce.sb_ecom.controller;

import com.ecommerce.sb_ecom.model.User;
import com.ecommerce.sb_ecom.payload.AddressDTO;
import com.ecommerce.sb_ecom.service.AddressService;
import com.ecommerce.sb_ecom.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CRUD endpoints for user addresses.
 *
 * <p>Addresses are tied to the authenticated user. All endpoints
 * are under {@code /api/addresses} or {@code /api/users/addresses}.</p>
 */
@RestController
@RequestMapping("/api")
public class AddressController {

    @Autowired
    private AddressService addressService;
    @Autowired
    private AuthUtil authUtil;

    /**
     * Creates a new address for the authenticated user.
     */
    @PostMapping("/addresses")
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO){
        User user = authUtil.loggedInUser();
        AddressDTO savedAddressDTO = addressService.createAddress(addressDTO , user);

        return new ResponseEntity<>(savedAddressDTO, HttpStatus.CREATED);
    }
    /**
     * Returns all addresses in the system.
     */
    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDTO>> getAddress(){
        List<AddressDTO> addressDTOList = addressService.getAddress();
     return  new ResponseEntity<>(addressDTOList, HttpStatus.OK);
    }
    /**
     * Returns a single address by its ID.
     */
    @GetMapping("/addresses/{addressId}")
    public ResponseEntity<AddressDTO> getAddressById(@PathVariable Long addressId){
        AddressDTO addressDTO = addressService.getAddressById(addressId);
        return  new ResponseEntity<>(addressDTO, HttpStatus.OK);
    }
    /**
     * Returns all addresses belonging to the authenticated user.
     */
    @GetMapping("/users/addresses")
    public ResponseEntity<List<AddressDTO>> getUserAddress(){
        User user = authUtil.loggedInUser();
        List<AddressDTO> addressDTOList = addressService.getUserAddress(user);
        return  new ResponseEntity<>(addressDTOList, HttpStatus.OK);
    }

    /**
     * Updates an existing address by its ID.
     */
    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<AddressDTO>  updateAddress(@PathVariable Long addressId
            , @RequestBody AddressDTO addressDTO){
        AddressDTO address = addressService.updateAddress(addressId, addressDTO);
        return  new ResponseEntity<>(address, HttpStatus.OK);
    }

    /**
     * Deletes an address by its ID.
     */
    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<String> deleteAddress(@PathVariable Long addressId){
        String status = addressService.deleteAddress(addressId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }
}
