package com.ecommerce.sb_ecom.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger UI configuration.
 *
 * <p>Registers a global JWT Bearer security scheme so that all endpoints
 * show an "Authorize" button in Swagger UI at {@code /swagger-ui/}.</p>
 */
@Configuration
public class SwaggerConfig {

    /**
     * Builds the {@link OpenAPI} descriptor with project metadata and
     * a Bearer JWT security scheme applied to every endpoint.
     *
     * @return the configured OpenAPI definition
     */
    @Bean
    public OpenAPI customOpenAPI(){
        SecurityScheme bearerScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("JWT Bearer Token");

        SecurityRequirement bearerRequirement = new SecurityRequirement()
                .addList("Bearer Authentication");
        return new OpenAPI()
                .info(new Info()
                        .title("Spring Boot eCommerce API")
                        .version("1.0")
                        .description("This is a Spring Boot Project for eCommerce")
                        .license(new License().name("Apache 2.0").url("http://SolydMan360.com"))
                        .contact(new Contact()
                                .name("Samuel Nketiah Boateng")
                                .email("boatengsamuel237@gmail.com")
                                .url("https://github.com/SolydSam")))
                .externalDocs(new ExternalDocumentation()
                        .description("Project Documentation")
                        .url("http://SolydSam360.com"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", bearerScheme))
                .addSecurityItem(bearerRequirement);
    }
}
