package com.saecdo18.petmily.kakaoLogin.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.bind.annotation.GetMapping;

public class AccessTokenDto {
//    public static class Request{
//        private String grant_type;
//        private String client_id;
//        private String redirect_uri;
//        private String grant_type;
//    }

    @ToString
    @Getter
    @Setter
    public static class Response{
        private String access_token;
        private String token_type;
        private String refresh_token;
        private long expires_in;
        private String scope;
        private long refresh_token_expires_in;

    }
}
