package com.saecdo18.petmily.walkmate.post.dto;

import com.saecdo18.petmily.walkmate.comment.entity.WalkMateComment;
import lombok.*;

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
        private Integer likes;
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
//        private Integer likes;
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
        private Integer likes;
        private List<WalkMateComment> comments;
    }
}
