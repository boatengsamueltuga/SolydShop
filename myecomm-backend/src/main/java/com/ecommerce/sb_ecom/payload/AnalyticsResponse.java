package com.ecommerce.sb_ecom.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Response DTO returned by {@code GET /api/admin/app/analytics}.
 * Provides high-level dashboard metrics: product count, total revenue, and total orders.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private String productCount;
    private String totalRevenue;
    private String totalOrders;
}
