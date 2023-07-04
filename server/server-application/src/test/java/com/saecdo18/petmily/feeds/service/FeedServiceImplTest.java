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
import com.saecdo18.petmily.image.entity.Image;
import com.saecdo18.petmily.image.repository.ImageRepository;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FeedServiceImplTest {
    private FeedService feedService;

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
    void createFeed_withImages_shouldSaveFeedAndImages() throws IOException {
        // Mock input data
        List<MultipartFile> images = new ArrayList<>();
        MockMultipartFile image1 = new MockMultipartFile("image", "image1.jpg", "image/jpeg", "Test Image 1".getBytes());
        MockMultipartFile image2 = new MockMultipartFile("image", "image2.jpg", "image/jpeg", "Test Image 2".getBytes());
        images.add(image1);
        images.add(image2);
        FeedDto.Post post = FeedDto.Post.builder()
                .memberId(1L)
                .content("test")
                .images(images)
                .build();

        // Mock methodFindByMemberId
        Member findMember = new Member();
        ReflectionTestUtils.setField(findMember, "memberId", 1L);
        when(memberRepository.findById(post.getMemberId())).thenReturn(Optional.of(findMember));

        // Mock S3UploadService
        String uploadFileURL1 = "https://example.com/images/image1.jpg";
        String uploadFileURL2 = "https://example.com/images/image2.jpg";
        when(s3UploadService.saveFile(eq(image1))).thenReturn(uploadFileURL1);
        when(s3UploadService.saveFile(eq(image2))).thenReturn(uploadFileURL2);

        // Mock feedRepository
        Feed savedFeed = new Feed();
        ReflectionTestUtils.setField(savedFeed, "feedId", 1L);
        when(feedRepository.save(any(Feed.class))).thenReturn(savedFeed);

        // Perform the test
        FeedDto.Response result = feedService.createFeed(post);

        // Verify the interactions
        verify(memberRepository).findById(post.getMemberId());
        verify(s3UploadService, times(2)).saveFile(any(MultipartFile.class));
        verify(feedRepository).save(any(Feed.class));

        // Assertions
        assertNotNull(result);
        assertEquals(savedFeed.getFeedId(), result.getFeedId());
        assertEquals(findMember.getMemberId(), result.getMemberId());
        // Add more assertions as needed
    }
}