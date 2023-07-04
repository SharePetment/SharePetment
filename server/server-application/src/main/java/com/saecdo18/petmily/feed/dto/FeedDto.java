package com.saecdo18.petmily.feed.dto;

import com.saecdo18.petmily.image.dto.ImageDto;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

public class FeedDto {

    @Data
    @Builder
    public static class Post {
        @NotBlank
        private Long memberId;
        @NotBlank
        private String content;
        private List<MultipartFile> images;

    }

    @Data
    @Builder
    public static class Patch{
        private Long feedId;
        private Long memberId;
        private String content;
        private List<MultipartFile> addImages;
        private List<String> deleteImages;
    }

    @Data
//    @Builder
    public static class Response {
        private Long feedId;
        private Long memberId;
        private List<ImageDto> images;
        private String content;
        private int likes;
        private boolean isLike;
        private List<FeedCommentDto.Response> feedComments;
        private String shareURL;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }

    @Data
    @Builder
    public static class Like {
        private int likeCount;
        private boolean isLike;
    }



}
