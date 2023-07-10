package com.saecdo18.petmily.member.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
public class FollowMemberDto {
    @Getter
    @Builder
    public static class Response{
        @Setter
        private MemberDto.Info memberInfo;

        private long followingId;
        private boolean follow;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }
}
