package com.saecdo18.petmily.member.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
public class MemberDto {
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Post{
        @NotBlank
        private String email;
        @NotBlank
        private String nickname;
        @NotBlank
        private String address;


    }

    @Getter
    @Setter
    public static class Patch{

        private String nickname;

        private String address;
    }

//    @Getter
//    @Setter
//    public static class PatchMessage{
//
//        private String statusMessage;
//
//
//    }

    @Getter
    @Builder
    public static class Response{
        private Long memberId;
        private String kakaoName;
        private String email;
        private String nickname;
        private String address;
//        private String statusMessage;
        private int followerCount;
        private boolean animalParents;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }
}
