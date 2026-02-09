package com.ecommerce.sb_ecom.security.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

/**
 * Request body for {@code POST /api/auth/signup}.
 *
 * <p>Carries username (3-20 chars), email, password (6-40 chars), and an
 * optional set of role names. If no roles are provided, the user defaults
 * to {@code ROLE_USER}.</p>
 */
@Data
public class SignupRequest {
    @NotBlank
    @Size(min =3, max = 20)
    private String username;

    @NotBlank
    @Size
    @Email
    private String email;

    private Set<String> role;

    @NotBlank
    @Size(min = 6, max =40)
    private String password;


}
