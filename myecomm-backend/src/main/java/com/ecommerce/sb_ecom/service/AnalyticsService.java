package com.ecommerce.sb_ecom.service;

import com.ecommerce.sb_ecom.payload.AnalyticsResponse;
import org.springframework.stereotype.Service;


/**
 * Contract for aggregating admin dashboard metrics.
 */
public interface AnalyticsService {
 AnalyticsResponse getAnalyticsData();
}
