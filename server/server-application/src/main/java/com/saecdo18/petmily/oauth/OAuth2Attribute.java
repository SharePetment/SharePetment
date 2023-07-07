package com.saecdo18.petmily.oauth;

import lombok.Builder;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public class OAuth2Attribute {
    private Map<String, Object> attributes;
    private String attributeKey;
    private String kakaoName;
    private String email;


    @Builder
    public OAuth2Attribute(Map<String, Object> attributes, String attributeKey, String kakaoName, String email) {
        this.attributes = attributes;
        this.attributeKey = attributeKey;
        this.kakaoName = kakaoName;
        this.email = email;
    }

    static OAuth2Attribute of(String provider, String attributeKey, Map<String, Object> attributes){
        return ofKakao("id", attributes);
    }

    private static OAuth2Attribute ofKakao(String attributeKey,
                                           Map<String, Object> attributes){
        //카카오 이메일 가져오기
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        // 카카오 닉네임 가져오기(이메일 안에 들어가야 있다고 함)
        Map<String, Object> kakaoProfile =  (Map<String, Object>) kakaoAccount.get("profile");

        return OAuth2Attribute.builder()
                .kakaoName((String) kakaoProfile.get("nickname"))
                .email((String) kakaoAccount.get("email"))
                .attributes(attributes)
                .attributeKey(attributeKey)
                .build();
    }

    Map<String, Object> convertToMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", attributeKey);
        map.put("key", attributeKey);
        map.put("kakaoName", kakaoName);
        map.put("email", email);


        return map;
    }


}
