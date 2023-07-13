package com.saecdo18.petmily.feed.service;

import com.saecdo18.petmily.awsConfig.S3UploadService;
import com.saecdo18.petmily.feed.entity.Feed;
import com.saecdo18.petmily.feed.entity.FeedImage;
import com.saecdo18.petmily.feed.mapper.FeedMapper;
import com.saecdo18.petmily.feed.repository.FeedCommentsRepository;
import com.saecdo18.petmily.feed.repository.FeedImageRepository;
import com.saecdo18.petmily.feed.repository.FeedLikeRepository;
import com.saecdo18.petmily.feed.repository.FeedRepository;
import com.saecdo18.petmily.image.entity.Image;
import com.saecdo18.petmily.image.repository.ImageRepository;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.FollowMemberRepository;
import com.saecdo18.petmily.member.repository.MemberRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedServiceImplTest {

    @Mock
    private FeedRepository feedRepository;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private FollowMemberRepository followMemberRepository;
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

    @InjectMocks
    private FeedServiceImpl feedService;

    @Test
    @DisplayName("피드 생성")
    void createFeed() {

    }

    @Test
    void getFeed() {
    }

    @Test
    void getFeedsRecent() {
    }

    @Test
    void getFeedsByMember() {
    }

    @Test
    void getFeedsByMemberFollow() {
    }

    @Test
    void patchFeed() {
    }

    @Test
    @DisplayName("피드 삭제 성공")
    void deleteFeedSuccess() {
        // given
        long feedId = 1L;
        long memberId = 1L;

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        Feed feed = Feed.builder()
                .content("content")
                .member(member)
                .build();
        ReflectionTestUtils.setField(feed, "feedId", feedId);
        Image image = Image.builder().originalFilename("image.jpg").uploadFileURL("http://image.jpg").build();
        FeedImage feedImage = FeedImage.builder().feed(feed).image(image).build();
        List<FeedImage> feedImageList = List.of(feedImage);
        ReflectionTestUtils.setField(feed, "feedImageList", feedImageList);

        given(feedRepository.findById(feedId)).willReturn(Optional.of(feed));
        given(memberRepository.findById(memberId)).willReturn(Optional.of(member));
        doNothing().when(s3UploadService).deleteImage(Mockito.anyString());
        doNothing().when(feedRepository).delete(feed);

        // when
        feedService.deleteFeed(feedId, memberId);

        verify(feedRepository, times(1)).delete(feed);
        verify(s3UploadService, times(feed.getFeedImageList().size())).deleteImage(Mockito.anyString());
    }

    @Test
    @DisplayName("피드 삭제 실패 - 피드를 찾을 수 없습니다.")
    void deleteFeedFailsWhenFeedNotFound() {
        // given
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", 1L);
        Feed feed =  new Feed();
        ReflectionTestUtils.setField(feed, "feedId", 1L);
        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());

        // when, then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> feedService.deleteFeed(feed.getFeedId(), member.getMemberId()));
        assertEquals("피드를 찾을 수 없습니다.", exception.getMessage());
        verify(feedRepository, never()).delete(any(Feed.class));
        verify(s3UploadService, never()).deleteImage(anyString());
    }

    @Test
    @DisplayName("피드 삭제 실패 - 삭제를 요청한 사용자와 피드를 작성한 사용자가 다르다.")
    void deleteFeedFailsWhenFeedMemberNotEqualsRequestMember() {
        // given
        long feedId = 1L;
        long feedMemberId = 2L;
        long requestMemberId = 3L;
        Member feedMember = new Member();
        ReflectionTestUtils.setField(feedMember, "memberId", feedMemberId);
        Feed feed = Feed.builder()
                .content("content")
                .member(feedMember)
                .build();
        ReflectionTestUtils.setField(feed, "feedId", feedId);
        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feed));

        // when, then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                feedService.deleteFeed(feedId, requestMemberId));

        assertEquals("삭제할 권한이 없습니다.", exception.getMessage());
        verify(feedRepository, never()).delete(any(Feed.class));
        verify(s3UploadService, never()).deleteImage(anyString());

    }

    @Test
    @DisplayName("피드 삭제 실패 - 사용자를 찾을 수 없습니다.")
    void deleteFeedFailsWhenMemberNotFound() {
        // given
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", 1L);
        Feed feed =  new Feed();
        ReflectionTestUtils.setField(feed, "feedId", 1L);
        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feed));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());

        // when
        RuntimeException exception = assertThrows(RuntimeException.class, () -> feedService.deleteFeed(feed.getFeedId(), member.getMemberId()));

        // then
        assertEquals("사용자를 찾을 수 없습니다.", exception.getMessage());
        verify(feedRepository, never()).delete(any(Feed.class));
        verify(s3UploadService, never()).deleteImage(anyString());
    }

    @Test
    @DisplayName("이미지 저장")
    void saveImage() {
        // given
        Feed feed = new Feed();
        String originalFilename = "image.jpg";
        String uploadFileURL = "http://example.com/image.jpg";
        Image image = Image.builder()
                .originalFilename(originalFilename)
                .uploadFileURL(uploadFileURL)
                .build();

        FeedImage feedImage = FeedImage.builder()
                .feed(feed)
                .image(image)
                .build();

        // when
        when(imageRepository.save(any(Image.class))).thenReturn(image);
        when(feedImageRepository.save(any(FeedImage.class))).thenReturn(feedImage);

        // then
        assertSame(image, imageRepository.save(image));
        assertSame(feedImage, feedImageRepository.save(feedImage));

    }

    @Test
    @DisplayName("피드 좋아요 성공")
    void likeByMemberSuccess() {
        long memberId = 1L;
        long feedId = 1L;
        Feed feed = new Feed();
        Member member = new Member();
        ReflectionTestUtils.setField(feed, "feedId", feedId);
        ReflectionTestUtils.setField(member, "memberId", memberId);

    }

    @Test
    @DisplayName("피드 좋아요 실패 - 피드를 찾을 수 없음.")
    void likeByMemberFailsWhenFeedNotFound() {
        long memberId = 1L;
        long feedId = 1L;
        Feed feed = new Feed();
        Member member = new Member();
        ReflectionTestUtils.setField(feed, "feedId", feedId);
        ReflectionTestUtils.setField(member, "memberId", memberId);


    }
}