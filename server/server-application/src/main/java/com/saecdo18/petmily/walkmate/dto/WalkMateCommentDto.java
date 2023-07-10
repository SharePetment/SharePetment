package com.saecdo18.petmily.walkmate.dto;

import com.saecdo18.petmily.member.dto.MemberDto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
public class WalkMateCommentDto {

    @Getter
    @Setter
    @ApiModel(value = "산책 댓글 생성 DTO")
    public static class Post{

        @ApiModelProperty(value = "내용", example = "내용1", required = true)
        private String content;
    }

    @Getter
    @Setter
    @ApiModel(value = "산책 댓글 수정 DTO")
    public static class Patch{

        @ApiModelProperty(value = "내용", example = "내용1", required = true)
        private String content;
    }

    @Getter
    @Setter
    @ApiModel(value = "산책 댓글 응답 DTO")
    public static class Response{

        @ApiModelProperty(value = "댓글 식별자", example = "1", required = true)
        private Long walkMateCommentId;
        @ApiModelProperty(value = "회원 정보", example = "1", required = true)
        private MemberDto.Info memberInfo;
        @ApiModelProperty(value = "게시글 식별자", example = "1", required = true)
        private Long walkMatePostId;
        @ApiModelProperty(value = "내용", example = "내용1", required = true)
        private String content;
        @ApiModelProperty(value = "생성 시간", example = "20231010", required = true)
        private LocalDateTime createdAt;
        @ApiModelProperty(value = "수정 시간", example = "20231010", required = true)
        private LocalDateTime modifiedAt;
    }
}