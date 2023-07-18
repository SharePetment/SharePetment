package com.saecdo18.petmily.kakaoLogin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.saecdo18.petmily.kakaoLogin.dto.KakaoProfile;
import com.saecdo18.petmily.kakaoLogin.dto.KakaoProfile;
import com.saecdo18.petmily.kakaoLogin.dto.MemberInfoAndJwtDto;
import com.saecdo18.petmily.kakaoLogin.service.KakaoService;
import com.saecdo18.petmily.util.AuthenticationGetMemberId;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class KakaoController {
    private final AuthenticationGetMemberId authenticationGetMemberId;
    private final KakaoService kakaoService;
    @GetMapping("/auth/kakao/callback")
    public MemberInfoAndJwtDto getCode(@RequestParam("code") String code,
                          HttpServletResponse response) throws IOException {
        String accessToken = kakaoService.getAccessToken(code);
        KakaoProfile kakaoProfile = kakaoService.getKakaoProfile(accessToken);
        MemberInfoAndJwtDto memberInfoAndJwtDto = kakaoService.login(kakaoProfile);
        kakaoService.setJwtTokenInHeader(response, memberInfoAndJwtDto);
        return memberInfoAndJwtDto;
    }

    @PostMapping("/auth/kakao/unlink")
    @ApiOperation(value = "@@@@멤버 탈.퇴. 메서드@@@ Access_Token에 연관된 멤버의 카카오 링크를 끊고 추가로 멤버db 정보도 삭제가 됩니다")
    public ResponseEntity<?> unlink(){
        long memberId = authenticationGetMemberId.getMemberId();

        kakaoService.unlink(memberId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
