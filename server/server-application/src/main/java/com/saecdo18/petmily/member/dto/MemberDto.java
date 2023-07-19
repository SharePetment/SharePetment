package com.saecdo18.petmily.member.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.saecdo18.petmily.pet.dto.PetDto;
import io.swagger.annotations.ApiModel;
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
    @ApiModel(value = "사용자 닉네임 중복 확인 요청 DTO")
    public static class NickCheckRequest{
        @ApiModelProperty(value = "닉네임", example = "초코아빠", required = true)
        private String nickname;
    }
    @Getter
    @Builder
    @ApiModel(value = "사용자 닉네임 중복 확인 응답 DTO")
    public static class NickCheckResponse{
        @ApiModelProperty(value = "닉네임 중복확인 메세지", example = "중복된 닉네임입니다", required = true)
        private String checkMessage;
        @ApiModelProperty(value = "닉네임 중복확인", example = "false", required = true)
        private boolean enable;
    }

    @Data
    @Builder
    @ApiModel(value = "사용자 정보 DTO")
    public static class Info{

        @ApiModelProperty(value = "사용자 아이디", example = "1", required = true)
        private Long memberId;
        @ApiModelProperty(value = "사용자 닉네임", example = "nickname", required = true)
        private String nickname;
        @ApiModelProperty(value = "대표 이미지 URL", example = "http://image.jpg", required = true)
        private String imageURL;
    }


    @Getter
    @Setter
    @ApiModel(value = "사용자 정보 수정 DTO")
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Patch{


        @ApiModelProperty(value = "닉네임", example = "초코아빠", required = true)
        private String nickname;
        @ApiModelProperty(value = "주소지", example = "서울시 강서구 마곡동", required = true)
        private String address;
    }


    @Getter
    @Builder
    @Setter
    @ApiModel(value = "사용자 정보 응답 DTO")
    public static class Response{
        @ApiModelProperty(value = "댓글 아이디", example = "1", required = true)
        private MemberDto.Info memberInfo;
        @ApiModelProperty(value = "카카오 이름", example = "김본명", required = true)
        private String name;
        @ApiModelProperty(value = "카카오 이메일", example = "gjjdiivu@naver.com", required = true)
        private String email;
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
