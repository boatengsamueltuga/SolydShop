package com.ecommerce.sb_ecom.security.services;

import com.ecommerce.sb_ecom.model.User;
import com.ecommerce.sb_ecom.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Loads a {@link User} from the database by username and converts it into a
 * {@link UserDetailsImpl} for Spring Security authentication.
 *
 * <p>Used by {@code DaoAuthenticationProvider} during login and by
 * {@link com.ecommerce.sb_ecom.security.jwt.AuthTokenFilter} when resolving
 * the principal from a JWT.</p>
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User Not Found with username"));
        return UserDetailsImpl.build(user);
    }
}
