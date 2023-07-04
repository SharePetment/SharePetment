package com.saecdo18.petmily.walkmate.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class WalkMateCommentResponseDto {

    private Long walkMateCommentId;
    private Long memberId;
    private String content;
}
