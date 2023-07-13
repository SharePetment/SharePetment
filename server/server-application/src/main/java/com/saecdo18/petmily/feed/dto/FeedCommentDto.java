package com.saecdo18.petmily.feed.dto;

import com.saecdo18.petmily.member.dto.MemberDto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class FeedCommentDto {


    @Builder
    @Getter
    @ApiModel(value = "피드 댓글 응답 DTO")
    public static class Response {
        @ApiModelProperty(value = "댓글 아이디", example = "1", required = true)
        private Long feedCommentsId;
        @ApiModelProperty(value = "사용자 정보", required = true)
        @Setter
        private MemberDto.Info memberInfo;
        @ApiModelProperty(value = "댓글 내용", example = "댓글 내용", required = true)
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }

    @Getter
    @Builder
    @ApiModel(value = "피드 댓글 생성 DTO")
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Post {
        @NotNull
        @ApiModelProperty(value = "사용자 아이디", example = "1", required = true)
        private Long memberId;
        @NotNull
        @ApiModelProperty(value = "피드 아이디", example = "1", required = true)
        private Long feedId;
        @NotNull
        @ApiModelProperty(value = "댓글 내용", example = "댓글 내용", required = true)
        private String content;
    }

    @Getter
    @NoArgsConstructor
    @ApiModel(value = "피드 댓글 수정 DTO")
    public static class Patch {
        @ApiModelProperty(value = "피드 id", example = "1", required = true)
        @NotNull
        private Long feedId;
        @ApiModelProperty(value = "댓글 내용", example = "댓글~~~~~", required = true)
        @NotNull
        private String content;

        @Builder
        public Patch(long feedId, String content) {
            this.feedId = feedId;
            this.content = content;
        }
    }


}
