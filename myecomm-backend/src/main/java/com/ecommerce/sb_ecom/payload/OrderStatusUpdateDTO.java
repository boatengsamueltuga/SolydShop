package com.ecommerce.sb_ecom.payload;

import lombok.Data;

/**
 * Request body for {@code PUT /api/admin/orders/{id}/status} and the
 * seller equivalent. Contains the new status string for the order.
 */
@Data
public class OrderStatusUpdateDTO {
    private String status;
}
