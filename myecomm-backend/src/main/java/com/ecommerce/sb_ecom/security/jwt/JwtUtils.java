package com.ecommerce.sb_ecom.security.jwt;

import com.ecommerce.sb_ecom.security.services.UserDetailsImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Utility for JWT token lifecycle: generation, extraction, and validation.
 *
 * <p>Supports two token transport mechanisms:</p>
 * <ul>
 *   <li><strong>HTTP-only cookie</strong> – primary method for browser clients.</li>
 *   <li><strong>Authorization header</strong> ({@code Bearer <token>}) – used by
 *       Swagger UI and non-browser clients.</li>
 * </ul>
 *
 * <p>Tokens are signed with an HMAC key derived from a Base64-encoded secret
 * ({@code app.jwt.secret}) and expire after {@code app.jwt.expiration-ms} milliseconds.</p>
 */
@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwt.expiration-ms:3600000}") // default 1 hour
    private int jwtExpirationMs;

    /** Base64-encoded HS key. Use at least 256-bit (32-byte) secret for HS256. */
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    @Value("${spring.ecom.app.jwtCookieName}")
    private String jwtCookie;

    //NB: This part was commented out because the JWT will be passed to us
    //in a form of cookie and not a header
//    // --- 1) Get JWT from Authorization header ---
//    public String getJwtFromHeader(HttpServletRequest request) {
//        String bearer = request.getHeader("Authorization");
//        logger.debug("Authorization Header: {}", bearer);
//        if (bearer != null && bearer.startsWith("Bearer ")) { // note the space
//            return bearer.substring(7).trim();
//        }
//        return null;
//    }

    //This method extracts JWT from the Browser cookie using the cookie name
    public  String getJwtFromCookies(HttpServletRequest request){
        Cookie cookie = WebUtils.getCookie(request, jwtCookie);
        if(cookie != null){
            System.out.println("COOKIE:" + cookie.getValue());
           return cookie.getValue();

        }else{
            return null;
        }
    }
 //This method below was added because I want to be able to
    //sign in through the Swagger UI
    public  String getJwtFromHeader(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        if(bearerToken  != null && bearerToken.startsWith("Bearer ")){
            return bearerToken.substring(7);
        }
        return null;
    }

    public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal){
        String jwt = generateTokenFromUserName(userPrincipal.getUsername());
        ResponseCookie cookie = ResponseCookie.from(jwtCookie, jwt)
                .path("/api")
                .maxAge(24 * 60 * 60 )
                .httpOnly(false)
                //this .secure(false) should be set to true in Production
                .secure(false)
                .build();
        return cookie;

    }
    public ResponseCookie getCleanJwtCookie(){
        ResponseCookie cookie = ResponseCookie.from(jwtCookie, null)
                .path("/api")
                .build();
        return cookie;
    }

    // --- 2) Generate token from username ---
    //public String generateTokenFromUserName(UserDetails userDetails)
    //The above commented code was changed to the below
    public String generateTokenFromUserName(String username) {
        //String username = userDetails.getUsername();
        Date now = new Date();
        Date exp = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(exp)
                .signWith(key())    // JJWT 0.12.x – alg inferred from key (HS)
                .compact();
    }

    // --- 3) Extract username from token ---
    public String getUserNameFromJWTToken(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // --- 4) Build signing key from Base64 secret ---
    public SecretKey key() {
        // jwtSecret must be Base64-encoded; length should suit HS alg (>= 32 bytes for HS256)
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    // --- 5) Validate token ---
    public boolean validateJwtToken(String authToken) {
        try {
            logger.debug("Validating JWT token");
            Jwts.parser()
                    .verifyWith(key())
                    .build()
                    .parseSignedClaims(authToken);  // success = valid structure, signature, and not expired
            return true;

        } catch (SecurityException e) {      // invalid signature / wrong key
            logger.warn("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {                        // bad format
            logger.warn("Malformed JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {                          // expired
            logger.warn("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {                      // alg/format unsupported
            logger.warn("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {                     // null/empty/illegal
            logger.warn("Empty or illegal JWT: {}", e.getMessage());
        }
        return false;
    }
}
