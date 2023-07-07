package com.saecdo18.petmily.member.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    USER("ROLE_USER"), GUEST("ROLE_GUEST");
    private final String key;
}