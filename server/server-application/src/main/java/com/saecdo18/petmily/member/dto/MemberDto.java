package com.saecdo18.petmily.member.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.saecdo18.petmily.pet.dto.PetDto;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.v3.oas.annotations.media.Schema;
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

        @ApiModelProperty(value = "사용자 아이디", example = "1", required = true)
        private Long memberId;
        @ApiModelProperty(value = "사용자 닉네임", example = "nickname", required = true)
        private String nickname;
        @ApiModelProperty(value = "대표 이미지 URL", example = "http://image.jpg", required = true)
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
        @ApiModelProperty(value = "사용자 닉네임", example = "홍길동", required = true)
        private String nickname;
        @ApiModelProperty(value = "사용자 주소", example = "서울시 임시구 임시동", required = true)
        private String address;
    }


    @Getter
    @Builder
    @Setter
    public static class Response{
        private MemberDto.Info memberInfo;
        private String name;
        private String address;
        private int followerCount;
        private int feedCount;
        private boolean animalParents;
        private boolean guestFollow;
        private List<PetDto.Response> pets;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;

//        private String statusMessage;


//        public void setGuestFollow(boolean guestFollow) {
//            this.guestFollow = guestFollow;
//        }

        public void setPets(List<PetDto.Response> pets) {
            this.pets = pets;
        }
    }
}
