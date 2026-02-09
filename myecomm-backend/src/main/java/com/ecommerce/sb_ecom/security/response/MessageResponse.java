package com.ecommerce.sb_ecom.security.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;


/**
 * Generic single-field response used for success/error messages from auth endpoints
 * (e.g., "User registered successfully!" or "Error: Username is already taken!").
 */
@Data
public class MessageResponse {
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }

}
