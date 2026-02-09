package com.ecommerce.sb_ecom.payload;

import com.ecommerce.sb_ecom.security.response.UserInfoResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseCookie;

/**
 * Internal transfer object passed from {@code AuthService} to {@code AuthController}
 * after a successful login. Bundles the user info response with the JWT cookie
 * so the controller can set the {@code Set-Cookie} header and return the body.
 */
@Data
@AllArgsConstructor
public class AuthenticationResult {
    private final UserInfoResponse response;
    private final ResponseCookie jwtCookie;

}
