package com.saecdo18.petmily.kakaoLogin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KakaoAccountDto {
    private boolean profile_nickname_needs_agreement;
    private ProfileDto profile;
    private boolean has_email;
    private boolean email_needs_agreement;
    private boolean is_email_valid;
    private boolean is_email_verified;
    private String email;
}
