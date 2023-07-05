package com.saecdo18.petmily.walkmate.comment.dto;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.walkmate.post.entity.WalkMate;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Data
public class WalkMateCommentDto {

//    private String content;
//    private Integer likes;
//    private WalkMate walkMate;
//    private Member member;
    @Getter
    @Setter
    public static class Post{

        private String content;
    }

    @Getter
    @Setter
    public static class Patch{

        private String content;
    }

    @Getter
    @Setter
    public static class Response{

        private Long commentId;
        private Long walkMatePostId;
        private Long memberId;
        private String content;
        private Integer likes;
    }
}
