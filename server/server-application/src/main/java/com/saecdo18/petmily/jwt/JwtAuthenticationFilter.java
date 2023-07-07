package com.saecdo18.petmily.jwt;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.authority.mapping.NullAuthoritiesMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenProvider tokenProvider;
    private final MemberRepository memberRepository;
    private static final List<String> NO_CHECK_URLS = Arrays.asList("/feeds/all", "https://kauth.kakao.com/oauth/authorize?client_id=07df97c2858e60b2e19f630c2c397b31&redirect_uri=http://localhost:8080/auth/kakao/callback&response_type=code");

    private GrantedAuthoritiesMapper authoritiesMapper = new NullAuthoritiesMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if (NO_CHECK_URLS.stream().anyMatch(request.getRequestURI()::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }

        String refreshToken = tokenProvider.extractRefreshToken(request)
                .filter(tokenProvider::isTokenValid)
                .orElse(null);

        if (refreshToken != null) {
            checkRefreshTokenAndReIssueAccessToken(response, refreshToken);
            return;
        }

        if (refreshToken == null) {
            checkAccessTokenAndAuthentication(request, response, filterChain);
        }

    }

    private void checkRefreshTokenAndReIssueAccessToken(HttpServletResponse response, String refreshToken) {
        memberRepository.findByRefreshToken(refreshToken).ifPresent(member -> {
            String reIssuedRefreshToken = reIssuedRefreshToken(member);
            tokenProvider.sendAccessAndRefreshToken(response, tokenProvider.createAccessToken(member.getMemberId()), reIssuedRefreshToken);
        });
    }

    private String reIssuedRefreshToken(Member member) {
        String reIssuedRefreshToken = tokenProvider.createRefreshToken();
        member.updateRefreshToken(reIssuedRefreshToken);
        memberRepository.saveAndFlush(member);
        return reIssuedRefreshToken;
    }


    private void checkAccessTokenAndAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        tokenProvider.extractAccessToken(request)
                .filter(tokenProvider::isTokenValid)
                .ifPresent(accessToken -> tokenProvider.extractMemberId(accessToken)
                        .ifPresent(memberId -> memberRepository.findById(memberId)
                                .ifPresent(this::saveAuthentication)));
        filterChain.doFilter(request,response);
    }

    private void saveAuthentication(Member member) {
        UserDetails userDetails = User.builder()
                .username(String.valueOf(member.getMemberId()))
                .password("null")
                .roles(member.getRole().name())
                .build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, authoritiesMapper.mapAuthorities(userDetails.getAuthorities()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
