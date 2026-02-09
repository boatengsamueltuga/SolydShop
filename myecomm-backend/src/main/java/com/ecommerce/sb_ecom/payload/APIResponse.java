package com.ecommerce.sb_ecom.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic response wrapper returned by endpoints that need only a message
 * and a success/failure flag (e.g. delete operations, validation errors).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class APIResponse {
    public String message;
    private boolean status;
}
