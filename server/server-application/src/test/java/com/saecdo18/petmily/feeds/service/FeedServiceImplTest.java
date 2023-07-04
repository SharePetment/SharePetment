package com.saecdo18.petmily.feeds.service;

import com.saecdo18.petmily.awsConfig.S3UploadService;
import com.saecdo18.petmily.feeds.dto.FeedDto;
import com.saecdo18.petmily.feeds.entity.Feed;
import com.saecdo18.petmily.feeds.entity.FeedImage;
import com.saecdo18.petmily.feeds.mapper.FeedMapper;
import com.saecdo18.petmily.feeds.repository.FeedCommentsRepository;
import com.saecdo18.petmily.feeds.repository.FeedImageRepository;
import com.saecdo18.petmily.feeds.repository.FeedLikeRepository;
import com.saecdo18.petmily.feeds.repository.FeedRepository;
import com.saecdo18.petmily.image.entity.Image;
import com.saecdo18.petmily.image.repository.ImageRepository;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
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
    public void testCreateFeed() throws IOException {
        long memberId = 1L;
        String content = "피드 내용";
        MultipartFile imageFile = new MockMultipartFile("image.jpg", new byte[0]);
        List<MultipartFile> images = new ArrayList<>();
        images.add(imageFile);

        // Mock 객체 설정
        Member mockMember = new Member();
        when(memberRepository.findById(memberId)).thenReturn(Optional.of(mockMember));

        Feed mockFeed = new Feed();
        when(feedRepository.save(any(Feed.class))).thenReturn(mockFeed);

        Image mockImage = new Image();
        when(imageRepository.save(any(Image.class))).thenReturn(mockImage);

        String uploadFileURL = "http://example.com/image.jpg";
        when(s3UploadService.saveFile(any(MultipartFile.class))).thenReturn(uploadFileURL);

        URI uri = feedService.createFeed(FeedDto.Post.builder()
                .memberId(memberId)
                .content(content)
                .images(images)
                .build());

        // 결과 검증
        assertNotNull(uri);
        assertEquals(BASE_URI + mockFeed.getFeedId(), uri.toString());

        verify(memberRepository, times(1)).findById(memberId);
        verify(feedRepository, times(1)).save(any(Feed.class));
        verify(imageRepository, times(images.size())).save(any(Image.class));
        verify(feedImageRepository, times(images.size())).save(any(FeedImage.class));
        verify(s3UploadService, times(images.size())).saveFile(any(MultipartFile.class));
    }
}