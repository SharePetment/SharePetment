package com.saecdo18.petmily.kakaoLogin.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class KakaoProfile {
    public String id; //User의 userid에 들어가기위해서 String으로 선언
    public String connected_at; //
    public Properties properties;
    public KakaoAccount kakao_account;

    public KakaoAccount getKakao_account() {
        return kakao_account;
    }



    @Getter
    @Setter
    public static class Properties {
        public String nickname;
    }

    @Getter
    @Setter
    public static class KakaoAccount {
        public Boolean profile_nickname_needs_agreement;
        public Profile profile;
        public Boolean has_email;
        public Boolean email_needs_agreement;
        public Boolean is_email_valid;
        public Boolean is_email_verified;
        public String email;
        @Getter
        @Setter
        public static class Profile {
            public String nickname;
        }
    }

//    public String getNickname(){
//        return kakao_account.getProfile().getNickname();
//    }

//    public String getEmail(){
//        return kakao_account.getEmail();
//    }

}
