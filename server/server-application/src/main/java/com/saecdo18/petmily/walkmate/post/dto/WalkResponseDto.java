package com.saecdo18.petmily.walkmate.post.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class WalkResponseDto {

    private Long walkMatePostId;
    private Long memberId;
    private String title;
    private String content;
    private String mapURL;
    private String chatURL;
    private String location;
    private String time;
    private Boolean open;
    private Integer maximum;
    private Integer likes;
}
