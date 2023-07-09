package com.saecdo18.petmily.member.mapper;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import org.mapstruct.Mapper;
import org.springframework.security.oauth2.core.user.OAuth2User;

@Mapper(componentModel = "spring")
public interface MemberMapper {
    Member memberPostDtoToMember(MemberDto.Post memberPostDto);

    MemberDto.Response memberToMemberResponseDto(Member member);

    MemberDto.Oauth oAuth2UserToMemberDto(OAuth2User oAuth2User);
}
