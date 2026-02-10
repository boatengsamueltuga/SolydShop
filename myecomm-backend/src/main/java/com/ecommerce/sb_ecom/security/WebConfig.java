package com.ecommerce.sb_ecom.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * MVC-layer CORS configuration.
 *
 * <p>Allows the same frontend origins as {@link WebSecurityConfig} at the
 * Spring MVC level. Security-layer CORS is handled separately in
 * {@code WebSecurityConfig.corsConfigurationSource()}.</p>
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${frontend.url}")
    private String frontEndUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:5173",
                        "https://solydshop-production-0bca.up.railway.app",
                        frontEndUrl
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true);
    }
}
