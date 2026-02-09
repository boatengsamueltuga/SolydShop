package com.ecommerce.sb_ecom.security.request;

import jakarta.validation.constraints.NotBlank;

/**
 * Request body for {@code POST /api/auth/signin}.
 *
 * <p>Both {@code username} and {@code password} are required
 * (validated with {@code @NotBlank}).</p>
 */
public class LoginRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
