package com.saecdo18.petmily.feed.dto;

import com.saecdo18.petmily.member.dto.MemberDto;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class FeedCommentDto {

    @Data
    public static class Response {
        private Long feedCommentsId;
        private MemberDto.Info memberInfo;
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;

    }
    @Data
    public static class Post {
        @NotNull
        private Long memberId;
        @NotNull
        private Long feedId;
        @NotNull
        private String content;
    }

    @Data
    public static class Patch {
        @NotNull
        private Long feedId;
        @NotNull
        private String content;
    }

//    @Data
//    public static class Like {
//        private int likeCount;
//        private boolean isLike;
//    }


}
