package com.saecdo18.petmily.member.mapper;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MemberMapper {
    Member memberPostDtoToMember(MemberDto.Post memberPostDto);

//    MemberDto.Response memberToMemberResponseDto(Member member);
}
