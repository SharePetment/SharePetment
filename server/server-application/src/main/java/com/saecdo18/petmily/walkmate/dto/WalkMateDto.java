package com.saecdo18.petmily.walkmate.dto;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class WalkMateDto {

    @Getter
    @Setter
//    @Builder
    public static class Post{

        //        private Long walkMatePostId;
        private Long memberId;
        private String title;
        private String content;
        private String mapURL;
        private String postswaggertest;
        private String chatURL;
        private String location;
        private String time;
        private Boolean open;
        private Integer maximum;
        private Integer likeCount;
//        private List<WalkMateComment> comments;
    }

    @Getter
    @Setter
//    @Builder
    public static class Patch{

        //        private Long walkMatePostId;
        @ApiModelProperty(value = "사용자 식별자", example = "1", required = true)
        private Long memberId;
        @ApiModelProperty(value = "제목", example = "제목1", required = true)
        private String title;
        @ApiModelProperty(value = "내용", example = "내용1", required = true)
        private String content;
        @ApiModelProperty(value = "이거 이스터에그", example = "이스터에그", required = true)
        private String patchswaggertest;
        @ApiModelProperty(value = "지도 URL", example = "hasfklasdjf", required = true)
        private String mapURL;
        @ApiModelProperty(value = "대화방 URL", example = "asdfjalsdf", required = true)
        private String chatURL;
        @ApiModelProperty(value = "산책 장소", example = "서울시 임시공원", required = true)
        private String location;
        @ApiModelProperty(value = "산책 시간", example = "2002.12.8", required = true)
        private String time;
        @ApiModelProperty(value = "모집 상태", example = "true", required = true)
        private Boolean open;
        @ApiModelProperty(value = "모집 인원", example = "3", required = true)
        private Integer maximum;
//        private Integer likeCount;
    }

    @Getter
    @Setter
//    @Builder
    public static class Response {

        private Long walkMatePostId;
        private MemberDto.Info memberInfo;
        private String title;
        private String content;
        private String mapURL;
        private String chatURL;
        private String location;
        private String time;
        private Boolean open;
        private Integer maximum;
        private Integer likeCount;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
        private List<WalkMateCommentDto.Response> comments;
    }

    @Data
    @Builder
    public static class Like{
        private int likeCount;
        private boolean isLike;
    }

    @Data
    @Builder
    public static class Open{
        private Long walkMatePostId;
        private Boolean open;
    }
}
