package com.saecdo18.petmily.kakaoLogin.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class KakaoAccessToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long kakaoAccessTokenId;
    private String email;
    private String kakaoAccessToken;

    public void updateAccesToken(String kakaoAccessToken){
        this.kakaoAccessToken=kakaoAccessToken;
    }
}
