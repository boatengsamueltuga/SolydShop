package com.ecommerce.sb_ecom.projectexceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a requested entity does not exist in the database.
 *
 * <p>Captures three diagnostic fields — {@code resourceName}, {@code fieldName},
 * and {@code fieldValue} — to produce messages like
 * <em>"Product not found with productId: 42"</em>.</p>
 *
 * <p>Annotated with {@code @ResponseStatus(NOT_FOUND)} and also handled by
 * {@link MyGlobalExceptionHandler}, which returns a {@code 404} response
 * with an {@link com.ecommerce.sb_ecom.payload.APIResponse} body.</p>
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final String resourceName;
    private final String fieldName;
    private final Object fieldValue;

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: %s", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public String getResourceName() { return resourceName; }
    public String getFieldName() { return fieldName; }
    public Object getFieldValue() { return fieldValue; }
}
