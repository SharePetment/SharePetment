package com.saecdo18.petmily.walkmate.post.mapper;

import com.saecdo18.petmily.walkmate.post.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.post.entity.WalkMate;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

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
            walkMate.likes(0);
            return walkMate.build();
        }
    }

    public default WalkMate walkPatchDtoToWalkMate(WalkMateDto.Patch patch) {
        if (patch == null) {
            return null;
        } else {
            WalkMate.WalkMateBuilder walkMate = WalkMate.builder();
            walkMate.title(patch.getTitle());
            walkMate.content(patch.getContent());
            walkMate.mapURL(patch.getMapURL());
            walkMate.chatURL(patch.getChatURL());
            walkMate.location(patch.getLocation());
            walkMate.time(patch.getTime());
            walkMate.open(patch.getOpen());
            walkMate.maximum(patch.getMaximum());
            return walkMate.build();
        }
    }
    public default WalkMateDto.Response walkMateToWalkMateResponseDto(WalkMate walkMate) {
        if (walkMate == null) {
            return null;
        } else {
            WalkMateDto.Response response = new WalkMateDto.Response();
            response.setWalkMatePostId(walkMate.getWalkMatePostId());
            response.setMemberId(walkMate.getMember().getMemberId());
            response.setTitle(walkMate.getTitle());
            response.setContent(walkMate.getContent());
            response.setMapURL(walkMate.getMapURL());
            response.setChatURL(walkMate.getChatURL());
            response.setLocation(walkMate.getLocation());
            response.setTime(walkMate.getTime());
            response.setOpen(walkMate.getOpen());
            response.setMaximum(walkMate.getMaximum());
            response.setLikes(walkMate.getLikes());
            return response;
        }
    }
}
