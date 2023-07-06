package com.saecdo18.petmily.feed.service;

import com.saecdo18.petmily.feed.dto.FeedDto;
import com.saecdo18.petmily.feed.entity.Feed;

import java.io.IOException;
import java.net.URI;
import java.util.List;

public interface FeedService {

    public FeedDto.Response createFeed(FeedDto.Post post) throws IOException;

    public FeedDto.Response getFeed(long feedId, long memberId);

    public List<FeedDto.Response> getFeedsRecent(FeedDto.PreviousListIds listIds);

    public List<FeedDto.Response> getFeedsByMember(int page, int size, long memberId);

    public List<FeedDto.Response> getFeedsByMemberFollow(long memberId, FeedDto.PreviousListIds listIds);

    public FeedDto.Response patchFeed(FeedDto.Patch patch) throws IOException;

    public void deleteFeed(long feedId, long memberId);

    public void saveImage(Feed feed, String originalFilename, String uploadFileURL);

    public FeedDto.Like likeByMember(long feedId, long memberId);
}
