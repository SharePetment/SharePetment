package com.saecdo18.petmily.walkmate.mapper;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.ArrayList;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WalkMateMapper {

    public default WalkMate walkPostDtoToWalkMate(WalkMateDto.Post post) {
        if (post == null) {
            return null;
        } else {
            WalkMate.WalkMateBuilder walkMate = WalkMate.builder();
            walkMate.title(post.getTitle());
            walkMate.content(post.getContent());
            walkMate.mapURL(post.getMapURL());
            walkMate.chatURL(post.getChatURL());
            walkMate.location(post.getLocation());
            walkMate.time(post.getTime());
            walkMate.open(post.getOpen());
            walkMate.maximum(post.getMaximum());
            walkMate.likeCount(0);
            return walkMate.build();
        }
    }

    public default WalkMateDto.Response walkPatchDtoToWalkMateResponseDto(WalkMateDto.Patch patch) {
        if (patch == null) {
            return null;
        } else {
            WalkMateDto.Response response = WalkMateDto.Response.builder()
                    .title(patch.getTitle())
                    .content(patch.getContent())
                    .mapURL(patch.getMapURL())
                    .chatURL(patch.getChatURL())
                    .location(patch.getLocation())
                    .time(patch.getTime())
                    .open(patch.getOpen())
                    .maximum(patch.getMaximum())
                    .build();
            return response;
        }
    }
    public default WalkMateDto.Response walkMateToWalkMateResponseDto(WalkMate walkMate) {
        if (walkMate == null) {
            return null;
        } else {
            WalkMateDto.Response response = WalkMateDto.Response.builder()
                    .walkMatePostId(walkMate.getWalkMatePostId())
                    .title(walkMate.getTitle())
                    .content(walkMate.getContent())
                    .mapURL(walkMate.getMapURL())
                    .chatURL(walkMate.getChatURL())
                    .location(walkMate.getLocation())
                    .time(walkMate.getTime())
                    .open(walkMate.getOpen())
                    .maximum(walkMate.getMaximum())
                    .likeCount(walkMate.getLikeCount())
                    .createdAt(walkMate.getCreatedAt())
                    .modifiedAt(walkMate.getModifiedAt())
                    .build();
            return response;
        }
    }

    public default WalkMateDto.Open walkMateToWalkMateOpenDto(WalkMate walkMate){
        if (walkMate == null) {
            return null;
        } else {

            WalkMateDto.Open response = WalkMateDto.Open.builder()
                    .walkMatePostId(walkMate.getWalkMatePostId())
                    .open(walkMate.getOpen())
                    .build();
            return response;
        }
    }
}
