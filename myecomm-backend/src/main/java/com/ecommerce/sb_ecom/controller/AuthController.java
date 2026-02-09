package com.ecommerce.sb_ecom.controller;

import com.ecommerce.sb_ecom.config.AppConstants;
import com.ecommerce.sb_ecom.payload.AuthenticationResult;
import com.ecommerce.sb_ecom.security.request.LoginRequest;
import com.ecommerce.sb_ecom.security.request.SignupRequest;
import com.ecommerce.sb_ecom.security.response.MessageResponse;
import com.ecommerce.sb_ecom.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Handles user authentication, registration, and session management.
 *
 * <p>All endpoints are under {@code /api/auth} and are publicly accessible
 * except where Spring Security requires an authenticated principal.</p>
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {


    @Autowired
    AuthService authService;

    /**
     * Authenticates a user and returns a JWT in both a Set-Cookie header and the response body.
     *
     * @param loginRequest username/email and password
     * @return {@link com.ecommerce.sb_ecom.security.response.UserInfoResponse} with JWT
     */
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        AuthenticationResult result = authService.login(loginRequest);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                result.getJwtCookie().toString())
                        .body(result.getResponse());
    }

    /**
     * Registers a new user account.
     *
     * @param signupRequest username, email, password, and optional roles
     * @return success or error message
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
       return  authService.registerUser(signupRequest);
    }

    /**
     * Returns the username of the currently authenticated user, or an empty string if unauthenticated.
     */
    @GetMapping("/username")
    public String currentUserName(Authentication authentication){
        if(authentication != null)
            return authentication.getName();
        else
            return "";
    }
    /**
     * Returns full profile details for the currently authenticated user.
     */
    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(Authentication authentication){


        return ResponseEntity.ok().body(authService.getCurrentUserDetails(authentication));

    }
    /**
     * Signs out the current user by invalidating the JWT cookie.
     */
    @PostMapping("signout")
            public ResponseEntity<?> signoutUser(){
        ResponseCookie cookie  = authService.logoutUser();
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                            cookie.toString())
                    .body(new MessageResponse("You have been signed out!"));

    }
    /**
     * Returns a paginated list of all users with the SELLER role.
     */
    @GetMapping("/sellers")
    public ResponseEntity<?> getAllSellers(
            @RequestParam(name= "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber
    ){
        Sort sortByAndOrder = Sort.by(AppConstants.SORT_USERS_BY).descending();
        Pageable pageDetails = PageRequest.of(pageNumber,Integer.parseInt(AppConstants.PAGE_SIZE),sortByAndOrder);
        return  ResponseEntity.ok(authService.getAllSellers(pageDetails));
    }
}
