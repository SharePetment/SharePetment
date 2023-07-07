package com.saecdo18.petmily.kakaoLogin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.saecdo18.petmily.kakaoLogin.dto.KakaoProfile;
import com.saecdo18.petmily.kakaoLogin.dto.KakaoProfile;
import com.saecdo18.petmily.kakaoLogin.dto.MemberInfoAndJwtDto;
import com.saecdo18.petmily.kakaoLogin.service.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class KakaoController {
    private final KakaoService kakaoService;
    @GetMapping("/auth/kakao/callback")
    public MemberInfoAndJwtDto getCode(@RequestParam("code") String code,
                          HttpServletResponse response) throws IOException {
        String accessToken = kakaoService.getAccessToken(code);
        KakaoProfile kakaoProfile = kakaoService.getKakaoProfile(accessToken);
        MemberInfoAndJwtDto memberInfoAndJwtDto = kakaoService.login(kakaoProfile);
        response = kakaoService.setJwtTokenInHeader(response, memberInfoAndJwtDto);
        return memberInfoAndJwtDto;
    }
}
