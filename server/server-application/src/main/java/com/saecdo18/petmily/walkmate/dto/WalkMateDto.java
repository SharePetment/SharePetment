package com.saecdo18.petmily.walkmate.dto;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class WalkMateDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ApiModel(value = "산책게시글 생성 DTO")
    public static class Post{

        //        private Long walkMatePostId;
//        @ApiModelProperty(value = "사용자 식별자", example = "1", required = true)
//        private Long memberId;
        @ApiModelProperty(value = "제목", example = "제목1", required = true)
        private String title;
        @ApiModelProperty(value = "내용", example = "내용1", required = true)
        private String content;
        @ApiModelProperty(value = "지도 URL", example = "kakaomap123", required = true)
        private String mapURL;
        @ApiModelProperty(value = "채팅방 URL", example = "kakaopen123", required = true)
        private String chatURL;
        @ApiModelProperty(value = "산책 장소", example = "서울시 강서구 마곡동", required = true)
        private String location;
        @ApiModelProperty(value = "산책 시간", example = "2002.12.8", required = true)
        private String time;
        @ApiModelProperty(value = "모집 상태", example = "true", required = true)
        private Boolean open;
        @ApiModelProperty(value = "모집 인원", example = "3", required = true)
        private Integer maximum;
        @ApiModelProperty(value = "좋아요 수", example = "3", required = true)
        private Integer likeCount;

        public Post(String title, String content) {
            this.title=title;
            this.content=content;
        }

//        private List<WalkMateComment> comments;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ApiModel(value = "산책게시글 수정 DTO")
    public static class Patch{

        //        private Long walkMatePostId;
//        @ApiModelProperty(value = "사용자 식별자", example = "1", required = true)
//        private Long memberId;
        @ApiModelProperty(value = "제목", example = "제목1", required = true)
        private String title;
        @ApiModelProperty(value = "내용", example = "내용1", required = true)
        private String content;
        @ApiModelProperty(value = "지도 URL", example = "kakaomap123", required = true)
        private String mapURL;
        @ApiModelProperty(value = "채팅방 URL", example = "kakaopen123", required = true)
        private String chatURL;
        @ApiModelProperty(value = "산책 장소", example = "서울시 강서구 마곡동", required = true)
        private String location;
        @ApiModelProperty(value = "산책 시간", example = "2002.12.8", required = true)
        private String time;
        @ApiModelProperty(value = "모집 상태", example = "true", required = true)
        private Boolean open;
        @ApiModelProperty(value = "모집 인원", example = "3", required = true)
        private Integer maximum;

        public Patch(String title, String content) {
            this.title=title;
            this.content=content;
        }
//        private Integer likeCount;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ApiModel(value = "산책게시글 응답 DTO")
    public static class Response {

        @ApiModelProperty(value = "게시글 식별자", example = "1", required = true)
        private Long walkMatePostId;
        @ApiModelProperty(value = "회원 정보", example = "1", required = true)
        private MemberDto.Info memberInfo;
        @ApiModelProperty(value = "제목", example = "제목1", required = true)
        private String title;
        @ApiModelProperty(value = "내용", example = "내용1", required = true)
        private String content;
        @ApiModelProperty(value = "지도 URL", example = "kakaomap123", required = true)
        private String mapURL;
        @ApiModelProperty(value = "채팅방 URL", example = "kakaopen123", required = true)
        private String chatURL;
        @ApiModelProperty(value = "산책 장소", example = "서울시 강서구 마곡동", required = true)
        private String location;
        @ApiModelProperty(value = "산책 시간", example = "2002.12.8", required = true)
        private String time;
        @ApiModelProperty(value = "모집 상태", example = "true", required = true)
        private Boolean open;
        @ApiModelProperty(value = "모집 인원", example = "3", required = true)
        private Integer maximum;
        @ApiModelProperty(value = "좋아요 수", example = "3", required = true)
        private Integer likeCount;
        @ApiModelProperty(value = "생성 시간", example = "20231010", required = true)
        private LocalDateTime createdAt;
        @ApiModelProperty(value = "수정 시간", example = "20231010", required = true)
        private LocalDateTime modifiedAt;
        @ApiModelProperty(value = "댓글", example = "comments:...", required = true)
        private List<WalkMateCommentDto.Response> comments;

        public Response(String title, String content) {
            this.title=title;
            this.content=content;
        }

        public Response(String title, String content, String location) {
            this.title=title;
            this.content=content;
            this.location=location;
        }
    }

    @Data
    @Builder
    @ApiModel(value = "산책게시글 좋아요 DTO")
    public static class Like{
        @ApiModelProperty(value = "좋아요 수", example = "3", required = true)
        private int likeCount;
        @ApiModelProperty(value = "좋아요 눌렀는지 여부", example = "true", required = true)
        private boolean isLike;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @Builder
    @ApiModel(value = "산책게시글 모집 여부 DTO")
    public static class Open{
        @ApiModelProperty(value = "게시글 식별자", example = "1", required = true)
        private Long walkMatePostId;
        @ApiModelProperty(value = "모집 상태", example = "true", required = true)
        private Boolean open;
    }
}
