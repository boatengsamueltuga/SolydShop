package com.ecommerce.sb_ecom.security.jwt;

import com.ecommerce.sb_ecom.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Per-request filter that extracts a JWT and populates the {@code SecurityContext}.
 *
 * <p>Token resolution order:</p>
 * <ol>
 *   <li>JWT cookie (primary, for browser clients).</li>
 *   <li>{@code Authorization: Bearer} header (fallback, for Swagger UI / API clients).</li>
 * </ol>
 *
 * <p>If a valid token is found, the corresponding {@code UserDetails} are loaded
 * and set as the current authentication principal.</p>
 */
public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        logger.debug("AuthTokenFilter called for URI: {}", request.getRequestURI());

        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJWTToken(jwt);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                logger.debug("Roles from JWT: {}", userDetails.getAuthorities());
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
    //The below code was disabled because of the Swagger UI

//    private String parseJwt(HttpServletRequest request) {
//        String cookieAuth = jwtUtils.getJwtFromCookies(request);
//        logger.debug("AuthTokenFilter.java: {}", cookieAuth);
//        return  cookieAuth;
//    }

    //The below code was enabled because of the Swagger UI
    private String parseJwt(HttpServletRequest request) {
        String jwtFromCookie = jwtUtils.getJwtFromCookies(request);
        if(jwtFromCookie != null){
            return  jwtFromCookie;
        }
        String jwtFromHeader = jwtUtils.getJwtFromHeader(request);
        if(jwtFromHeader != null){
            return jwtFromHeader;
        }
        return null;
    }
}
