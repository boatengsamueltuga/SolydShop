package com.ecommerce.sb_ecom.projectexceptions;

/**
 * General-purpose unchecked exception for business-rule violations.
 *
 * <p>Thrown by service-layer code when an operation cannot be completed
 * (e.g., duplicate category name, empty cart checkout). Handled globally
 * by {@link MyGlobalExceptionHandler}, which returns a {@code 400 Bad Request}
 * with an {@link com.ecommerce.sb_ecom.payload.APIResponse} body.</p>
 */
public class APIException extends RuntimeException{
    private static final long serialVersionUID = 1L;

    public APIException() {
    }

    public APIException(String message) {
        super(message);
    }
}
