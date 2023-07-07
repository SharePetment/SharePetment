//package com.saecdo18.petmily.oauth;
//
//import com.saecdo18.petmily.member.entity.Member;
//import com.saecdo18.petmily.member.repository.MemberRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
//import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
//import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
//import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
//import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.stereotype.Service;
//
//import java.util.Collections;
//
//@Service
//@Slf4j
//@RequiredArgsConstructor
//public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
//    private final MemberRepository memberRepository;
//
//    @Override
//    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//        OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService = new DefaultOAuth2UserService();
//        OAuth2User oAuth2User = oAuth2UserService.loadUser(userRequest);
//
//        // OAuth2 서비스 id (구글, 카카오, 네이버)
//        String registrationId = userRequest.getClientRegistration()
//                .getRegistrationId();
//        // OAuth2 로그인 진행 시 키가 되는 필드 값(PK)
//        String userNameAttributeName = userRequest.getClientRegistration()
//                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
//
//        log.info("registrationId = {}", registrationId);
//        log.info("userNameAttributeName = {}", userNameAttributeName);
//
//        // OAuth2UserService
//        OAuth2Attribute oAuth2Attribute = OAuth2Attribute
//                .of(registrationId, userNameAttributeName, oAuth2User.getAttributes());
//
//        log.info("OAuthAttribute : {}", oAuth2Attribute);
//
//        Member member;
//
//        if (memberRepository.findByEmail(oAuth2Attribute.getEmail()).isEmpty()){
//            member= Member.builder()
//                    .name(oAuth2Attribute.getKakaoName())
//                    .email(oAuth2Attribute.getEmail())
//                    .build();
//            memberRepository.save(member);
//        }
//        else{
//            member = memberRepository.findByEmail(oAuth2Attribute.getEmail()).get();
//        }
//
//        var memberAttribute = oAuth2Attribute.convertToMap();
//
//        return new DefaultOAuth2User(Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")), memberAttribute, "email");
//    }
//
//    private void saveMember(OAuth2Attribute oAuth2Attribute) {
//        String email = oAuth2Attribute.getEmail();
//        String name = oAuth2Attribute.getKakaoName();
//
//
//        System.out.println("---------- 로그인 정보 ----------");
//        System.out.println(" 이름  : " + name);
//        System.out.println(" 이메일 : " + email);
//        System.out.println("-------------------------------");
//
//        Member member = Member.builder()
//                .email(email)
//                .name(name)
//                .build();
//        memberRepository.save(member);
//    }
//}
