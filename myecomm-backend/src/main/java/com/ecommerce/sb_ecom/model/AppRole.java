package com.ecommerce.sb_ecom.model;

/**
 * Enumeration of application-level roles used for Spring Security authorization.
 *
 * <ul>
 *   <li>{@code ROLE_USER} — standard customer; can browse, manage cart, and place orders.</li>
 *   <li>{@code ROLE_SELLER} — can list and manage their own products and view seller orders.</li>
 *   <li>{@code ROLE_ADMIN} — full access to all management and analytics endpoints.</li>
 * </ul>
 */
public enum AppRole {
    ROLE_USER,
    ROLE_SELLER,
    ROLE_ADMIN
}
