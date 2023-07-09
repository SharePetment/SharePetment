package com.saecdo18.petmily.kakaoLogin.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.kakaoLogin.dto.AccessTokenDto;
import com.saecdo18.petmily.kakaoLogin.dto.KakaoProfile;

import com.saecdo18.petmily.kakaoLogin.dto.MemberInfoAndJwtDto;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoService {
    private final MemberRepository memberRepository;
    private final TokenProvider tokenProvider;

//    @Value("spring.")
    public String getAccessToken(String code) throws JsonProcessingException {
        WebClient client = WebClient.create("https://kauth.kakao.com/oauth/token");
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();

        formData.add("grant_type" , "authorization_code");
        formData.add("client_id" , "07df97c2858e60b2e19f630c2c397b31");
        formData.add("redirect_uri" , "http://ec2-52-79-250-145.ap-northeast-2.compute.amazonaws.com:8080/auth/kakao/callback");
        formData.add("code" , code);

        String accessTokenRequest = client.post()
                .uri("https://kauth.kakao.com/oauth/token")
                .body(BodyInserters.fromFormData(formData))
                .header("Content-type","application/x-www-form-urlencoded;charset=utf-8")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper objectMapper = new ObjectMapper();
        AccessTokenDto.Response accessToken= objectMapper.readValue(accessTokenRequest, AccessTokenDto.Response.class);
        return accessToken.getAccess_token();
    }

    public KakaoProfile getKakaoProfile(String accessToken) throws JsonProcessingException {
        WebClient client = WebClient.create("https://kapi.kakao.com/v2/user/me");
        String response = client.post()
                .uri("https://kapi.kakao.com/v2/user/me")
                .header("Authorization", "Bearer "+accessToken)
                .header("Content-type","application/x-www-form-urlencoded;charset=utf-8")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper objectMapper = new ObjectMapper();
        KakaoProfile kakaoProfile = objectMapper.readValue(response, KakaoProfile.class);

        return kakaoProfile;
    }

    private Optional<Member> isRegister(String email){

        return memberRepository.findByEmail(email);
    }

    public MemberInfoAndJwtDto login(KakaoProfile kakaoProfile){
        String email = kakaoProfile.getKakao_account().getEmail();
        String nickname = kakaoProfile.getKakao_account().getProfile().getNickname();

        Optional<Member> optionalMember = isRegister(email);
        Member responseMember;
        boolean present=false;
        if(optionalMember.isPresent()){
            responseMember= optionalMember.get();
            present=true;
        }
        else{
            Member registerMember = new Member();
            registerMember.updateRegisterMember(nickname, email);

            registerMember.setDefaultImage();

            responseMember = memberRepository.save(registerMember);
        }


        MemberInfoAndJwtDto memberInfoAndJwtDto = MemberInfoAndJwtDto.builder()
                .memberId(responseMember.getMemberId())
                .name(responseMember.getName())
                .email(responseMember.getEmail())
                .present(present)
                .build();

        return memberInfoAndJwtDto;
    }

    public HttpServletResponse setJwtTokenInHeader(HttpServletResponse response, MemberInfoAndJwtDto memberInfoAndJwtDto) throws IOException {
        String accessToken = tokenProvider.createAccessToken(memberInfoAndJwtDto.getMemberId());
        String refreshToken = tokenProvider.createRefreshToken();

        tokenProvider.sendAccessAndRefreshToken(response, accessToken, refreshToken);
        Member refreshMember= memberRepository.findById(memberInfoAndJwtDto.getMemberId()).get();
        refreshMember.updateRefreshToken(refreshToken);

        if(memberInfoAndJwtDto.isPresent()){
            response.sendRedirect("http://localhost:5374/home");
        }
        else {
            response.sendRedirect("http://localhost:5374/info");
        }

        return response;
    }

}
