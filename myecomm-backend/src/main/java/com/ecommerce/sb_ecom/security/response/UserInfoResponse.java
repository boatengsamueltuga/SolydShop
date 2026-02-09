package com.ecommerce.sb_ecom.security.response;

import java.util.List;

/**
 * Response body returned after successful authentication at {@code POST /api/auth/signin}.
 *
 * <p>Contains the user's id, username, email, JWT token, and granted role names
 * so that the frontend can store credentials and render role-appropriate UI.</p>
 */
public class UserInfoResponse {
    private Long id;
    private String username;
    private String jwtToken;
    private String email;
    private List<String> roles;

    public UserInfoResponse(Long id, String username, String jwtToken, String email,  List<String> roles) {
        this.id = id;
        this.username = username;
        this.jwtToken = jwtToken;
        this.email = email;
        this.roles = roles;

    }

    public UserInfoResponse(Long id, String username, List<String> roles) {
        this.id = id;
        this.username = username;
        this.jwtToken = jwtToken;
        this.roles = roles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getJwtToken() {
        return jwtToken;
    }

    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public List<String> getRoles() {
        return roles;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

}
