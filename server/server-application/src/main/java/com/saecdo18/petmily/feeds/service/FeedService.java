package com.saecdo18.petmily.feeds.service;

import com.saecdo18.petmily.feeds.dto.FeedDto;
import com.saecdo18.petmily.feeds.entity.Feed;

import java.io.IOException;
import java.net.URI;
import java.util.List;

public interface FeedService {

    public URI createFeed(FeedDto.Post post) throws IOException;

    public FeedDto.Response getFeed(long feedId, long memberId);

    public void saveImage(Feed feed, String originalFilename, String uploadFileURL);

    public FeedDto.Like likeByMember(long feedId, long memberId);
}
