package com.saecdo18.petmily.kakaoLogin.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class MemberInfoAndJwtDto {
    private long memberId;
    private String name;
    private String email;
    private boolean present;
//    private String accessToken;
//    private String refreshToken;
}
