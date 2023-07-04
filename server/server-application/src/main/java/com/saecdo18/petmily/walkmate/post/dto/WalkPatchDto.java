package com.saecdo18.petmily.walkmate.post.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class WalkPatchDto {

    private String title;
    private String content;
    private String mapURL;
    private String chatURL;
    private String location;
    private String time;
    private Boolean open;
    private Integer maximum;
}
