package com.saecdo18.petmily.member.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
public class FollowMemberDto {
    @Getter
    @Builder
    @ApiModel(value = "팔로우 사용자 정보 응답 DTO")
    public static class Response{
        @Setter
        private MemberDto.Info memberInfo;
        @ApiModelProperty(value = "팔로윙 한 사용자", example = "7", required = true)
        private long followingId;
        @ApiModelProperty(value = "팔로우 상태", example = "true", required = true)
        private boolean follow;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }
}
