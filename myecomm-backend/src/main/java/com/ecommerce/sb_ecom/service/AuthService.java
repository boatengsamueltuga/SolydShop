package com.ecommerce.sb_ecom.service;

import com.ecommerce.sb_ecom.payload.AuthenticationResult;
import com.ecommerce.sb_ecom.payload.UserResponse;
import com.ecommerce.sb_ecom.security.request.LoginRequest;
import com.ecommerce.sb_ecom.security.request.SignupRequest;
import com.ecommerce.sb_ecom.security.response.MessageResponse;
import com.ecommerce.sb_ecom.security.response.UserInfoResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

/**
 * Authentication and user management contract.
 *
 * <p>Responsibilities: credential validation, JWT issuance, user registration
 * with role assignment, session teardown, and seller listing.</p>
 */
public interface AuthService {
    AuthenticationResult login(LoginRequest loginRequest);

    ResponseEntity<MessageResponse> registerUser(@Valid SignupRequest signupRequest);

    UserInfoResponse getCurrentUserDetails(Authentication authentication);

    ResponseCookie logoutUser();

    UserResponse getAllSellers(Pageable pageDetails);
}
