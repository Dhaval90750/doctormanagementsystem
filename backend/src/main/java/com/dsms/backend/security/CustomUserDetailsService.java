package com.dsms.backend.security;

import com.dsms.backend.domain.Permission;
import com.dsms.backend.domain.PlatformUser;
import com.dsms.backend.domain.User;
import com.dsms.backend.repository.PlatformUserRepository;
import com.dsms.backend.repository.UserRepository;
import com.dsms.backend.tenant.TenantContext;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final PlatformUserRepository platformUserRepository;
    private final UserRepository userRepository;

    public CustomUserDetailsService(PlatformUserRepository platformUserRepository, UserRepository userRepository) {
        this.platformUserRepository = platformUserRepository;
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        // 1. Check Platform Users first (Super Admins)
        TenantContext.setCurrentTenant("platform");
        Optional<PlatformUser> platformUserOpt = platformUserRepository.findByEmail(username);
        
        if (platformUserOpt.isPresent()) {
            PlatformUser pUser = platformUserOpt.get();
            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + pUser.getRole()));
            authorities.add(new SimpleGrantedAuthority(pUser.getRole())); // Support hasAuthority("SUPER_ADMIN")
            
            return new CustomUserDetails(
                    pUser.getEmail(),
                    pUser.getPasswordHash(),
                    authorities,
                    "platform",
                    pUser.isActive()
            );
        }

        // 2. We don't have a specific tenant context here because the login endpoint
        // normally needs to know which tenant to query. For now, if we are in a multi-tenant 
        // login scenario, the tenant must be set before this point, or we query all tenants.
        // For simplicity in this mock, we assume TenantContext is already set if it's a tenant login.
        
        String currentTenant = TenantContext.getCurrentTenant();
        if (currentTenant != null && !currentTenant.equals("platform")) {
            Optional<User> userOpt = userRepository.findByEmail(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                List<GrantedAuthority> authorities = new ArrayList<>();
                if (user.getRole() != null) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));
                    authorities.add(new SimpleGrantedAuthority(user.getRole().getName()));
                    for (Permission perm : user.getRole().getPermissions()) {
                        authorities.add(new SimpleGrantedAuthority(perm.getName()));
                    }
                }
                
                return new CustomUserDetails(
                        user.getEmail(),
                        user.getPassword(),
                        authorities,
                        currentTenant,
                        user.isActive()
                );
            }
        }
        
        throw new UsernameNotFoundException("User not found: " + username);
    }
}
