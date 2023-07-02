package com.saecdo18.serverapplication.test.post.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PostResponseDto {

    private long postId;
    private String title;
    private String detail;
}
