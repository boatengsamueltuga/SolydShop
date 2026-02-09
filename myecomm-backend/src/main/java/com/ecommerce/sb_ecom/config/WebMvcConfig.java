package com.ecommerce.sb_ecom.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring MVC customization for serving static resources.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * Maps {@code /images/**} URL requests to the local {@code images/} directory
     * so product images uploaded to the filesystem are accessible over HTTP.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**").addResourceLocations("file:images/");
    }
}
