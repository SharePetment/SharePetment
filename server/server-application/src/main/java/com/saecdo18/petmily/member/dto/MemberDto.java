package com.saecdo18.petmily.member.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.saecdo18.petmily.pet.dto.PetDto;
import lombok.*;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class MemberDto {
    @Getter
    @Builder
    public static class Oauth{
        private String KakaoName;
        private String email;
    }
    @Getter
    @Builder
    public static class NickCheckRequest{
        @NotBlank
        private String nickname;
    }
    @Getter
    @Builder
    public static class NickCheckResponse{
        private String checkMessage;
        private boolean enable;
    }

    @Data
    @Builder
    public static class Info{
        private Long memberId;
        private String nickname;
        private String imageURL;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Post{

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


    @Getter
    @Builder
    public static class Response{
        private Long memberId;
        private String name;
        private String email;
        private String nickname;
        private String address;
        private int followerCount;
        private int feedCount;
        private boolean animalParents;
        private boolean guestFollow;
        private List<PetDto.Response> pets;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;

//        private String statusMessage;


        public void setGuestFollow(boolean guestFollow) {
            this.guestFollow = guestFollow;
        }

        public void setPets(List<PetDto.Response> pets) {
            this.pets = pets;
        }
    }
}
