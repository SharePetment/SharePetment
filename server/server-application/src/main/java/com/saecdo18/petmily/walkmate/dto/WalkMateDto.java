package com.saecdo18.petmily.walkmate.dto;

import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
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
        private Long memberId;
        private String title;
        private String content;
        private String mapURL;
        private String chatURL;
        private String location;
        private String time;
        private Boolean open;
        private Integer maximum;
//        private Integer likeCount;
    }

    @Getter
    @Setter
//    @Builder
    public static class Response {

        private Long walkMatePostId;
        private Long memberId;
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
        private List<WalkMateComment> comments;
    }

    @Data
    @Builder
    public static class Like{
        private int likeCount;
        private boolean isLike;
    }
}
