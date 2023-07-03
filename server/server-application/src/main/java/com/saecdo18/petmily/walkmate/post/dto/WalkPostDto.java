package com.saecdo18.petmily.walkmate.post.dto;

import lombok.Builder;

@Builder
public class WalkPostDto {

    private long memberId;
    private String title;
    private String content;
    private String mapURL;
    private String chatURL;
    private String location;
    private String time;
    private Boolean open;
    private int maximum;
}
