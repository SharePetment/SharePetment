package com.saecdo18.petmily.oauth;

import com.saecdo18.petmily.jwt.TokenProvider;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.mapper.MemberMapper;
import com.saecdo18.petmily.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.Optional;

@RequiredArgsConstructor
@Component
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final MemberMapper memberMapper;
    private final MemberRepository memberRepository;
    private final TokenProvider tokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        MemberDto.Oauth memberOauthDto = memberMapper.oAuth2UserToMemberDto(oAuth2User);

        log.info("Principal에서 꺼낸 OAuth2User = {}", oAuth2User);
        log.info("토큰 발행 시작");

        Optional<Member> optionalMember = memberRepository.findByEmail(memberOauthDto.getEmail());

        if(optionalMember.isEmpty()){
            throw new RuntimeException("해당 이메일을 가진 멤버를 찾을 수 없습니다");
        }

        String accessToken = tokenProvider.createAccessToken(optionalMember.get().getMemberId());
        String refreshToken =  tokenProvider.createRefreshToken();
        String uid = String.valueOf(optionalMember.get().getMemberId());

        log.info("{}", accessToken);
        log.info("{}", refreshToken);
        log.info("{}", uid);


        String redirectUrl = createURI(accessToken, refreshToken, uid).toString();

    }

    private URI createURI(String accessToken, String refreshToken, String uid) {
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("access_token", accessToken);
        queryParams.add("refresh_token", refreshToken);
        queryParams.add("UID", uid);

        return UriComponentsBuilder
                .newInstance()
                .scheme("http")
                .host("localhost")
                .port(5173)
                .queryParams(queryParams)
                .build()
                .toUri();
    }
}
