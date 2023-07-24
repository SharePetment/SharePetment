package com.saecdo18.petmily.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationGetMemberId {
    public Long getMemberId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName().equals("anonymousUser") ? 0 : Long.parseLong(authentication.getName());
    }
}
