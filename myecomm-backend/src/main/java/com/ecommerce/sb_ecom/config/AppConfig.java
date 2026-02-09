package com.ecommerce.sb_ecom.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * General application bean definitions.
 */
@Configuration
public class AppConfig {

    /**
     * Provides a shared {@link ModelMapper} instance for entity-to-DTO conversions.
     *
     * @return a default-configured ModelMapper
     */
    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    };

}
