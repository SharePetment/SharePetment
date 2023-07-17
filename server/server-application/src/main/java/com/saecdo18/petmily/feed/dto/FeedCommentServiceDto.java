package com.saecdo18.petmily.feed.dto;

import com.saecdo18.petmily.member.dto.MemberDto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class FeedCommentServiceDto {


    @Builder
    @Getter
    public static class Response {
        private Long feedCommentsId;
        @Setter
        private MemberDto.Info memberInfo;
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Post {
        private Long feedId;
        private String content;
    }

    @Getter
    @NoArgsConstructor
    public static class Patch {
        private Long feedId;
        private String content;

        @Builder
        public Patch(long feedId, String content) {
            this.feedId = feedId;
            this.content = content;
        }
    }


}
