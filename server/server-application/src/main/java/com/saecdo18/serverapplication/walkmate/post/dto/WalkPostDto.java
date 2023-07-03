package com.saecdo18.serverapplication.walkmate.post.dto;

import lombok.Builder;

import javax.persistence.*;

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
