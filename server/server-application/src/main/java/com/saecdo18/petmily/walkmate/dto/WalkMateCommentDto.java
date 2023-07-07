package com.saecdo18.petmily.walkmate.dto;

import com.saecdo18.petmily.member.dto.MemberDto;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

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
        private MemberDto.Info memberInfo;
        private Long walkMatePostId;
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }
}