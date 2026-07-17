package com.dsms.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final String username; // email
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final String tenantId;
    private final boolean isActive;

    public CustomUserDetails(String username, String password, Collection<? extends GrantedAuthority> authorities, String tenantId, boolean isActive) {
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.tenantId = tenantId;
        this.isActive = isActive;
    }

    public String getTenantId() {
        return tenantId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }
}
