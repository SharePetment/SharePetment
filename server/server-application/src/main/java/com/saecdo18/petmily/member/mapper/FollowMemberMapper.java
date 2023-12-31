package com.saecdo18.petmily.member.mapper;

import com.saecdo18.petmily.member.dto.FollowMemberDto;
import com.saecdo18.petmily.member.entity.FollowMember;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FollowMemberMapper {
    default FollowMemberDto.Response followMemberToFollowMemberResponseDto(FollowMember followMember){
        FollowMemberDto.Response response = FollowMemberDto.Response.builder()
                .createdAt(followMember.getCreatedAt())
                .modifiedAt(followMember.getModifiedAt())
                .build();

        return response;
    }

    List<FollowMemberDto.Response> followMemberToFollowMemberResponseDtos(List<FollowMember> followMembers);

}
