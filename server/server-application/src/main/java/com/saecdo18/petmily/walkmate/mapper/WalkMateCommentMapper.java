package com.saecdo18.petmily.walkmate.mapper;

import com.saecdo18.petmily.walkmate.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WalkMateCommentMapper {

    public default WalkMateComment commentPostDtoToComment(WalkMateCommentDto.Post post){
        if (post == null) {
            return null;
        } else {
            WalkMateComment.WalkMateCommentBuilder comment = WalkMateComment.builder();
            comment.content(post.getContent());
            return comment.build();
        }
    }

    public default WalkMateComment commentPatchDtoToComment(WalkMateCommentDto.Patch patch){
        if (patch == null) {
            return null;
        } else {
            WalkMateComment.WalkMateCommentBuilder comment = WalkMateComment.builder();
            comment.content(patch.getContent());
            return comment.build();
        }
    }

    public default WalkMateCommentDto.Response commentToCommentResponseDto(WalkMateComment comment){
        if (comment == null) {
            return null;
        } else {
            WalkMateCommentDto.Response response = new WalkMateCommentDto.Response();
            response.setCommentId(comment.getWalkMateCommentId());
            response.setWalkMatePostId(comment.getWalkMate().getWalkMatePostId());
            response.setContent(comment.getContent());
            response.setCreatedAt(comment.getCreatedAt());
            response.setModifiedAt(comment.getModifiedAt());
            return response;
        }
    }

}
