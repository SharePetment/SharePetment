package com.saecdo18.petmily.feed.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.member.dto.MemberDto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

public class FeedServiceDto {

    @Builder
    @Getter
    public static class Post {
        private String content;
        private List<MultipartFile> images;
    }

    @Builder
    @Getter
    public static class Patch{
        private Long feedId;
        private String content;
        private List<MultipartFile> addImages;
        private List<String> deleteImages;
    }

    @Setter
    @Getter
    @Builder
    public static class Response {
        private Long feedId;

        private MemberDto.Info memberInfo;

        private List<ImageDto> images;

        private String content;

        private int likes;

        private boolean isLike;

        private List<FeedCommentDto.Response> feedComments;

        private String shareURL;

        private LocalDateTime createdAt;

        private LocalDateTime modifiedAt;
    }

    @Builder
    @Getter
    public static class Like {
        private int likeCount;
        private boolean isLike;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class PreviousListIds {
        private List<Long> previousListIds;
    }
}
