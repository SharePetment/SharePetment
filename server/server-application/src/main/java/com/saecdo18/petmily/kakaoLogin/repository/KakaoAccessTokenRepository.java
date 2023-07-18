package com.saecdo18.petmily.kakaoLogin.repository;

import com.saecdo18.petmily.kakaoLogin.entity.KakaoAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KakaoAccessTokenRepository extends JpaRepository<KakaoAccessToken, Long> {
    Optional<KakaoAccessToken> findByEmail(String email);
}
