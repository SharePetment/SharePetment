package com.saecdo18.petmily.feeds.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FeedCommentDto {
    private Long feedCommentId;
    private Long memberId;
    private int likes;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
