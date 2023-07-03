package com.saecdo18.petmily.member.dto;

import lombok.Builder;
import lombok.Getter;

import javax.validation.constraints.NotBlank;

public class MemberDto {
    @Getter
    @Builder
    public static class Post{
        @NotBlank
        private String email;
        @NotBlank
        private String nickname;
        @NotBlank
        private String address;
    }

//    @Getter
//    @Builder
//    public static class Response{
//        private Long memberId;
//
//        private String email;
//        private String nickname;
//        private String address;
//        private String statusMessage;
//        private int followerCount;
//        private String createdAt;
//        private String updatedAt;
//    }
}
