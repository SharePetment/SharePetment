package com.saecdo18.petmily.kakaoLogin.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.kakaoLogin.dto.AccessTokenDto;
import com.saecdo18.petmily.kakaoLogin.dto.KakaoProfile;

import com.saecdo18.petmily.kakaoLogin.dto.MemberInfoAndJwtDto;
import com.saecdo18.petmily.kakaoLogin.entity.KakaoAccessToken;
import com.saecdo18.petmily.kakaoLogin.repository.KakaoAccessTokenRepository;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;
import reactor.core.publisher.Mono;


import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoService {
    private final MemberRepository memberRepository;
    private final TokenProvider tokenProvider;
    private final KakaoAccessTokenRepository kakaoAccessTokenRepository;
    private final MemberService memberService;

    public String getAccessToken(String code) throws JsonProcessingException {
        WebClient client = WebClient.create("https://kauth.kakao.com/oauth/token");
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();

        formData.add("grant_type" , "authorization_code");
        formData.add("client_id" , "07df97c2858e60b2e19f630c2c397b31");
        formData.add("redirect_uri" , "http://43.202.86.53:8080/auth/kakao/callback");
//        formData.add("redirect_uri" , "http://localhost:8080/auth/kakao/callback");
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

        String email = kakaoProfile.getKakao_account().getEmail();
        Optional<KakaoAccessToken> optionalKakaoAccessToken = kakaoAccessTokenRepository.findByEmail(email);

        if(optionalKakaoAccessToken.isEmpty()){
            KakaoAccessToken kakaoAccessToken = KakaoAccessToken.builder().kakaoAccessToken(accessToken).email(email).build();

            kakaoAccessTokenRepository.save(kakaoAccessToken);
        }
        else{
            KakaoAccessToken kakaoAccessToken = optionalKakaoAccessToken.get();
            kakaoAccessToken.updateAccesToken(accessToken);
            kakaoAccessTokenRepository.save(kakaoAccessToken);
        }

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
            if(responseMember.getNickname() == null || responseMember.getAddress() == null){
                present=false;
            }
            else {
                present=true;
            }

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
        URI uri = createUri(accessToken,refreshToken,memberInfoAndJwtDto);



        response.sendRedirect(uri.toString());



        return response;
    }

    private URI createUri(String accessToken, String refreshToken, MemberInfoAndJwtDto memberInfo){
        long memberId = memberInfo.getMemberId();
        Member member = memberRepository.findById(memberId).get();

        MultiValueMap<String, String> queryParams= new LinkedMultiValueMap<>();
        String enCodeName = UriUtils.encode(memberInfo.getName(), StandardCharsets.UTF_8);
        queryParams.add("accessToken", accessToken);
        queryParams.add("refreshToken", refreshToken);
        queryParams.add("memberId", String.valueOf(memberId));
        queryParams.add("name", enCodeName);
        queryParams.add("email", memberInfo.getEmail());
        queryParams.add("present", String.valueOf(memberInfo.isPresent()));
        queryParams.add("animalParents", String.valueOf(member.isAnimalParents()));

        return UriComponentsBuilder.newInstance()
                .scheme("http")
//                .host("localhost")
                .host("share-petment.s3-website.ap-northeast-2.amazonaws.com")
//                .port(5374)
                .path("loading")
                .queryParams(queryParams)
                .build()
                .toUri();
    }

    public void unlink(long memberId){
        Member findMember = memberRepository.findById(memberId).get();
        String email = findMember.getEmail();

        KakaoAccessToken kakaoAccessToken = kakaoAccessTokenRepository.findByEmail(email).get();
        String accessToken = kakaoAccessToken.getKakaoAccessToken();

        memberService.deleteMember(memberId);
        kakaoAccessTokenRepository.delete(kakaoAccessToken);


        WebClient client = WebClient.create("https://kapi.kakao.com/v1/user/unlink");
        String response = client.post()
                .uri("https://kapi.kakao.com/v1/user/unlink")
                .header("Authorization", "Bearer "+accessToken)
                .header("Content-type","application/x-www-form-urlencoded;charset=utf-8")
                .retrieve()
                .bodyToMono(String.class)
                .block();



    }

}
