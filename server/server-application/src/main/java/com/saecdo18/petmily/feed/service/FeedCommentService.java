package com.saecdo18.petmily.feed.service;

import com.saecdo18.petmily.feed.dto.FeedCommentDto;

public interface FeedCommentService {

    public FeedCommentDto.Response createComment(FeedCommentDto.Post post);
    public FeedCommentDto.Response updateComment(FeedCommentDto.Patch patch, long commentId, long memberId);
    public void deleteComment(long commentId, long memberId);

//    public FeedCommentDto.Like likeComment(long commentId, long memberId);
}
