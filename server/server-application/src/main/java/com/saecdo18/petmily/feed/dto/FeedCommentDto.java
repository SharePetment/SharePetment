package com.saecdo18.petmily.feed.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FeedCommentDto {
    private Long feedCommentsId;
    private Long memberId;
    private int likes;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
