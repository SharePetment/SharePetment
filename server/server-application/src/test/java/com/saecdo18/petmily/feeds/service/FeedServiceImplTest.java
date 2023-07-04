package com.saecdo18.petmily.feeds.service;

import com.saecdo18.petmily.awsConfig.S3UploadService;
import com.saecdo18.petmily.feed.dto.FeedDto;
import com.saecdo18.petmily.feed.entity.Feed;
import com.saecdo18.petmily.feed.entity.FeedImage;
import com.saecdo18.petmily.feed.mapper.FeedMapper;
import com.saecdo18.petmily.feed.repository.FeedCommentsRepository;
import com.saecdo18.petmily.feed.repository.FeedImageRepository;
import com.saecdo18.petmily.feed.repository.FeedLikeRepository;
import com.saecdo18.petmily.feed.repository.FeedRepository;
import com.saecdo18.petmily.feed.service.FeedService;
import com.saecdo18.petmily.feed.service.FeedServiceImpl;
import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.image.entity.Image;
import com.saecdo18.petmily.image.repository.ImageRepository;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FeedServiceImplTest {
    @InjectMocks
    private FeedServiceImpl feedService;

    @Mock
    private FeedRepository feedRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private FeedImageRepository feedImageRepository;

    @Mock
    private S3UploadService s3UploadService;

    @Mock
    private FeedCommentsRepository feedCommentsRepository;
    @Mock
    private FeedLikeRepository feedLikeRepository;

    @Mock
    private FeedMapper feedMapper;


    private static final String BASE_URI = "http://localhost:8080/feeds/";

    FeedServiceImplTest() {
    }

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        feedService = new FeedServiceImpl(feedRepository, memberRepository, imageRepository, feedImageRepository, s3UploadService,feedCommentsRepository,feedLikeRepository, feedMapper);
    }



    @Test
    void createFeedTest() throws IOException {
        // Given
        long memberId = 1L;
        String content = "Sample content";
        MultipartFile multipartFile = mock(MultipartFile.class);
        FeedDto.Post post = FeedDto.Post.builder()
                .memberId(memberId)
                .content(content)
                .images(Collections.singletonList(multipartFile))
                .build();

        Member findMember = new Member();
        ReflectionTestUtils.setField(findMember, "memberId", 1L);
        when(memberRepository.findById(memberId)).thenReturn(Optional.of(findMember));

        Feed createFeed = new Feed();
        ReflectionTestUtils.setField(createFeed, "content", content);
        ReflectionTestUtils.setField(createFeed, "member", findMember);
        ReflectionTestUtils.setField(createFeed, "feedId", 1L);
        when(feedRepository.save(any(Feed.class))).thenReturn(createFeed);

        // Mocking saveImage() method
        when(s3UploadService.saveFile(any(MultipartFile.class))).thenReturn("http://example.com/image.jpg");

        // Mocking getFeed() method
        FeedDto.Response expectedResponse = new FeedDto.Response();
//        when(feedService.getFeed(createFeed.getFeedId(), memberId)).thenReturn(expectedResponse);

        // When
//        FeedDto.Response result = feedService.createFeed(post);
//        // Then
//        // Verify the interactions and assertions
//        verify(memberRepository, times(1)).findById(memberId);
//        verify(feedRepository, times(1)).save(any(Feed.class));
//        verify(s3UploadService, times(1)).saveFile(any(MultipartFile.class));
//        verify(feedService, times(1)).getFeed(createFeed.getFeedId(), memberId);
//
//        // Add additional assertions as needed
    }
}