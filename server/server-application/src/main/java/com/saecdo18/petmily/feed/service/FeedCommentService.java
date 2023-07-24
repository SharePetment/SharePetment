package com.saecdo18.petmily.feed.service;

import com.saecdo18.petmily.feed.dto.FeedCommentDto;
import com.saecdo18.petmily.feed.dto.FeedCommentServiceDto;

public interface FeedCommentService {

    public FeedCommentDto.Response createComment(FeedCommentServiceDto.Post post, long memberId);
    public FeedCommentDto.Response updateComment(FeedCommentServiceDto.Patch patch, long commentId, long memberId);
    public void deleteComment(long commentId, long memberId);

//    public FeedCommentDto.Like likeComment(long commentId, long memberId);
}
