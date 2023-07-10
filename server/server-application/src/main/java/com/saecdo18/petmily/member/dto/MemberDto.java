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
        @ApiModelProperty(value = "닉네임 중복확인 메세지", example = "중복된 닉네임입니다", required = true)
        private String checkMessage;
        @ApiModelProperty(value = "닉네임 중복확인", example = "false", required = true)
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
        @Schema(description = "닉네임")
        private String nickname;
        @Schema(description = "주소")
        private String address;
    }


    @Getter
    @Builder
    @Setter
    public static class Response{
        @ApiModelProperty(value = "댓글 아이디", example = "1", required = true)
        private MemberDto.Info memberInfo;
        @ApiModelProperty(value = "카카오 이름", example = "김본명", required = true)
        private String name;
        @ApiModelProperty(value = "주소지", example = "서울시 강서구 마곡동", required = true)
        private String address;
        @ApiModelProperty(value = "팔로워 수", example = "7", required = true)
        private int followerCount;
        @ApiModelProperty(value = "피드 수", example = "8", required = true)
        private int feedCount;
        @ApiModelProperty(value = "견주 인증", example = "true", required = true)
        private boolean animalParents;
        @ApiModelProperty(value = "구독버튼 on/off", example = "false", required = true)
        private boolean guestFollow;
        @ApiModelProperty(value = "반려동물 리스트", example = "1111", required = true)
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
