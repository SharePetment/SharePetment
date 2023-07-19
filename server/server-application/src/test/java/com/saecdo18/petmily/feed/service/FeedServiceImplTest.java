package com.saecdo18.petmily.feed.service;

import com.saecdo18.petmily.awsConfig.S3UploadService;
import com.saecdo18.petmily.feed.dto.FeedCommentDto;
import com.saecdo18.petmily.feed.dto.FeedDto;
import com.saecdo18.petmily.feed.dto.FeedDtoList;
import com.saecdo18.petmily.feed.dto.FeedServiceDto;
import com.saecdo18.petmily.feed.entity.Feed;
import com.saecdo18.petmily.feed.entity.FeedImage;
import com.saecdo18.petmily.feed.entity.FeedLike;
import com.saecdo18.petmily.feed.mapper.FeedMapper;
import com.saecdo18.petmily.feed.repository.FeedCommentsRepository;
import com.saecdo18.petmily.feed.repository.FeedImageRepository;
import com.saecdo18.petmily.feed.repository.FeedLikeRepository;
import com.saecdo18.petmily.feed.repository.FeedRepository;
import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.image.entity.Image;
import com.saecdo18.petmily.image.repository.ImageRepository;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.FollowMember;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
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
    @DisplayName("피드 생성 성공 - 이미지 없음")
    void createFeedSuccessWhenNoImage() throws IOException {
        long memberId = 1L;
        long feedId = 1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        ReflectionTestUtils.setField(member, "feedCount", 0);

        List<MultipartFile> imageList = new ArrayList<>();
        FeedServiceDto.Post post = FeedServiceDto.Post.builder()
                .content("content")
                .images(imageList)
                .build();

        Feed feed = Feed.builder()
                .content("content")
                .member(member)
                .build();
        ReflectionTestUtils.setField(feed, "feedId", feedId);

        List<FeedCommentDto.Response> feedCommentDtoList = new ArrayList<>();
        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(memberId)
                .build();
        List<FeedImage> feedImageList = new ArrayList<>();
        List<ImageDto> imageDtoList = new ArrayList<>();
        FeedDto.Response response = FeedDto.Response.builder()
                .feedId(feed.getFeedId())
                .feedComments(feedCommentDtoList)
                .memberInfo(memberInfo)
                .images(imageDtoList)
                .content(feed.getContent())
                .build();

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(feedRepository.saveAndFlush(Mockito.any(Feed.class))).willReturn(feed);
        given(feedMapper.FeedToFeedDtoResponse(Mockito.any(Feed.class))).willReturn(response);
        given(feedCommentsRepository.findByFeedFeedId(Mockito.anyLong())).willReturn(Optional.empty());
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(feedImageRepository.findByFeed(Mockito.any(Feed.class))).willReturn(feedImageList);
        given(feedLikeRepository.findByMemberAndFeed(Mockito.any(Member.class), Mockito.any(Feed.class))).willReturn(Optional.empty());

        FeedDto.Response result = feedService.createFeed(post, memberId);

        assertEquals(result.getFeedId(), feedId);
        assertEquals(result.getLikes(), 0);
        assertEquals(result.getImages().size(), 0);
        assertEquals(result.getMemberInfo().getMemberId(), memberId);
        assertEquals(result.getContent(), post.getContent());
        assertEquals(result.getShareURL(), "http://43.202.86.53:8080/feeds/all/"+feedId);
        assertEquals(member.getFeedCount(), 1);
    }

    @Test
    @DisplayName("피드 생성 성공 - 이미지 있음")
    void createFeedSuccessWhenHaveImage() throws IOException {
        long memberId = 1L;
        long feedId = 1L;
        String uploadFileURL = "http://image.jpg";
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        ReflectionTestUtils.setField(member, "feedCount", 0);

        List<MultipartFile> imageList = List.of(new MockMultipartFile("image", "gitimage.png", "image/png",
                new FileInputStream(getClass().getResource("/gitimage.png").getFile())));
        FeedServiceDto.Post post = FeedServiceDto.Post.builder()
                .content("content")
                .images(imageList)
                .build();

        Feed feed = Feed.builder()
                .content("content")
                .member(member)
                .build();
        ReflectionTestUtils.setField(feed, "feedId", feedId);

        List<FeedCommentDto.Response> feedCommentDtoList = new ArrayList<>();
        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(memberId)
                .build();
        Image image = Image.builder().uploadFileURL(uploadFileURL).build();
        FeedImage feedImage = FeedImage.builder().feed(feed).image(image).build();
        List<FeedImage> feedImageList = new ArrayList<>();
        feedImageList.add(feedImage);
        ImageDto imageDto = ImageDto.builder().build();
        List<ImageDto> imageDtoList = new ArrayList<>();
        imageDtoList.add(imageDto);
        FeedDto.Response response = FeedDto.Response.builder()
                .feedId(feed.getFeedId())
                .feedComments(feedCommentDtoList)
                .memberInfo(memberInfo)
                .images(imageDtoList)
                .content(feed.getContent())
                .build();

        // createFeed()
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(s3UploadService.saveFile(Mockito.any(MultipartFile.class), Mockito.anyString())).willReturn(uploadFileURL);
        given(imageRepository.save(Mockito.any(Image.class))).willReturn(image);
        given(feedImageRepository.save(Mockito.any(FeedImage.class))).willReturn(feedImage);
        given(feedRepository.saveAndFlush(Mockito.any(Feed.class))).willReturn(feed);
        // changeFeedToFeedDto
        given(feedMapper.FeedToFeedDtoResponse(Mockito.any(Feed.class))).willReturn(response);
        given(feedCommentsRepository.findByFeedFeedId(Mockito.anyLong())).willReturn(Optional.empty());
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(feedImageRepository.findByFeed(Mockito.any(Feed.class))).willReturn(feedImageList);
        given(feedMapper.imageToImageDto(Mockito.any(Image.class))).willReturn(imageDto);
        given(feedLikeRepository.findByMemberAndFeed(Mockito.any(Member.class), Mockito.any(Feed.class))).willReturn(Optional.empty());

        FeedDto.Response result = feedService.createFeed(post, memberId);

        assertEquals(result.getFeedId(), feedId);
        assertEquals(result.getLikes(), 0);
        assertEquals(result.getImages().size(), 1);
        assertEquals(result.getMemberInfo().getMemberId(), memberId);
        assertEquals(result.getContent(), post.getContent());
    }

    @Test
    @DisplayName("피드 생성 실패 - 사용자를 찾을 수 없습니다.")
    void createFeedFailsWhenMemberNotFound() throws IOException {
        long memberId = 1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        ReflectionTestUtils.setField(member, "feedCount", 0);

        List<MultipartFile> imageList = List.of(new MockMultipartFile("image", "gitimage.png", "image/png",
                new FileInputStream(getClass().getResource("/gitimage.png").getFile())));
        FeedServiceDto.Post post = FeedServiceDto.Post.builder()
                .content("content")
                .images(imageList)
                .build();

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, () -> feedService.createFeed(post, memberId));

        assertEquals(exception.getMessage(), "사용자를 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("피드 가져오기 성공")
    void getFeedSuccess(){
        long feedId = 1L;
        long memberId = 1L;
        String uploadFileURL = "http://image.jpg";
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        Feed findFeed = Feed.builder().member(member).content("content").build();
        ReflectionTestUtils.setField(findFeed, "feedId", feedId);
        List<FeedCommentDto.Response> feedCommentDtoList = new ArrayList<>();
        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(memberId)
                .build();
        Image image = Image.builder().uploadFileURL(uploadFileURL).build();
        FeedImage feedImage = FeedImage.builder().feed(findFeed).image(image).build();
        List<FeedImage> feedImageList = new ArrayList<>();
        feedImageList.add(feedImage);
        ImageDto imageDto = ImageDto.builder().build();
        List<ImageDto> imageDtoList = new ArrayList<>();
        imageDtoList.add(imageDto);
        FeedLike feedLike = FeedLike.builder().feed(findFeed).member(member).build();
        ReflectionTestUtils.setField(feedLike, "isLike", true);
        FeedDto.Response response = FeedDto.Response.builder()
                .feedId(findFeed.getFeedId())
                .feedComments(feedCommentDtoList)
                .memberInfo(memberInfo)
                .images(imageDtoList)
                .content(findFeed.getContent())
                .build();

        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.of(findFeed));
        given(feedMapper.FeedToFeedDtoResponse(Mockito.any(Feed.class))).willReturn(response);
        given(feedCommentsRepository.findByFeedFeedId(Mockito.anyLong())).willReturn(Optional.empty());
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(feedImageRepository.findByFeed(Mockito.any(Feed.class))).willReturn(feedImageList);
        given(feedMapper.imageToImageDto(Mockito.any(Image.class))).willReturn(imageDto);
        given(feedLikeRepository.findByMemberAndFeed(Mockito.any(Member.class), Mockito.any(Feed.class))).willReturn(Optional.of(feedLike));

        FeedDto.Response result = feedService.getFeed(feedId, memberId);

        assertEquals(result.getFeedId(), feedId);
        assertEquals(result.getLikes(), 0);
        assertEquals(result.getImages().size(), 1);
        assertNotEquals(result.getMemberInfo().getMemberId(), 0);
        assertEquals(result.getContent(), "content");
        assertTrue(result.isLike());
        assertNotNull(result.getImages());
    }

    @Test
    @DisplayName("피드 가져오기 실패 - 피드를 찾을 수 없습니다.")
    void getFeedFailsWhenFeedNotFound() {
        long feedId = 1L;
        long memberId = 1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        Feed findFeed = Feed.builder().member(member).build();
        ReflectionTestUtils.setField(findFeed, "feedId", feedId);

        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> feedService.getFeed(feedId, memberId));

        assertEquals(exception.getMessage(), "피드를 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("피드 최신순 가져오기 성공")
    void getFeedsRecent() {
        long memberId = 1L;
        long totalCount = 1L;
        FeedServiceDto.PreviousListIds listIds = new FeedServiceDto.PreviousListIds();
        listIds.setPreviousListIds(new ArrayList<Long>(){});
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", 2L);
        Feed feed = new Feed();
        ReflectionTestUtils.setField(feed, "feedId", 1L);
        ReflectionTestUtils.setField(feed, "member", member);
        List<Feed> pageDataList = List.of(feed);
        Page<Feed> pageFeed = new PageImpl<>(pageDataList);
        List<Feed> feedList = List.of(feed);
        MemberDto.Info memberInfo = MemberDto.Info.builder().memberId(1L).build();
        List<FeedImage> feedImageList = new ArrayList<>();
        Image image = new Image();
        ReflectionTestUtils.setField(image, "imageId", 1L);
        FeedImage feedImage = FeedImage.builder().image(image).feed(feed).build();
        feedImageList.add(feedImage);
        ImageDto imageDto = ImageDto.builder().imageId(image.getImageId()).build();
        List<ImageDto> imageDtoList = List.of(imageDto);
        FeedDto.Response response = FeedDto.Response.builder()
                .feedId(1L)
                .memberInfo(memberInfo)
                .images(imageDtoList)
                .build();

        given(feedRepository.count()).willReturn(totalCount);
        given(feedRepository.findAll(Mockito.any(PageRequest.class))).willReturn(pageFeed);

        given(feedMapper.FeedToFeedDtoResponse(Mockito.any(Feed.class))).willReturn(response);
        given(feedCommentsRepository.findByFeedFeedId(Mockito.anyLong())).willReturn(Optional.empty());
        given(feedImageRepository.findByFeed(Mockito.any(Feed.class))).willReturn(feedImageList);
        given(feedMapper.imageToImageDto(Mockito.any(Image.class))).willReturn(imageDto);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));

        FeedDtoList result = feedService.getFeedsRecent(memberId, 0, 10);

        assertEquals(result.getResponseList().size(), 1);
    }

    @Test
    @DisplayName("사용자 피드 리스트 가져오기")
    void getFeedsByMember() {
        int page = 0;
        int size = 10;
        long memberId = 1L;
        FeedDto.PreviousListIds listIds = new FeedDto.PreviousListIds();
        listIds.setPreviousListIds(new ArrayList<Long>(){});
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", 2L);
        Feed feed = new Feed();
        ReflectionTestUtils.setField(feed, "feedId", 1L);
        ReflectionTestUtils.setField(feed, "member", member);
        List<Feed> pageDataList = List.of(feed);
        Page<Feed> pageFeed = new PageImpl<>(pageDataList);
        List<Feed> feedList = List.of(feed);
        MemberDto.Info memberInfo = MemberDto.Info.builder().memberId(1L).build();
        List<FeedImage> feedImageList = new ArrayList<>();
        Image image = new Image();
        ReflectionTestUtils.setField(image, "imageId", 1L);
        FeedImage feedImage = FeedImage.builder().image(image).feed(feed).build();
        feedImageList.add(feedImage);
        ImageDto imageDto = ImageDto.builder().imageId(image.getImageId()).build();
        List<ImageDto> imageDtoList = List.of(imageDto);
        FeedDto.Response response = FeedDto.Response.builder()
                .feedId(1L)
                .memberInfo(memberInfo)
                .images(imageDtoList)
                .build();

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(feedRepository.findAllByMemberOrderByCreatedAtDesc(Mockito.any(Member.class),Mockito.any(PageRequest.class))).willReturn(pageFeed);

        given(feedMapper.FeedToFeedDtoResponse(Mockito.any(Feed.class))).willReturn(response);
        given(feedCommentsRepository.findByFeedFeedId(Mockito.anyLong())).willReturn(Optional.empty());
        given(feedImageRepository.findByFeed(Mockito.any(Feed.class))).willReturn(feedImageList);
        given(feedMapper.imageToImageDto(Mockito.any(Image.class))).willReturn(imageDto);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));

        FeedDtoList result = feedService.getFeedsByMember(page, size, memberId);

        assertEquals(result.getResponseList().size(), 1);

    }

    @Test
    @DisplayName("팔로우한 사용자들의 리스트 가져오기")
    void getFeedsByMemberFollow() {
        long memberId = 1L;
        List<FollowMember> followMemberList = new ArrayList<>();
        FeedServiceDto.PreviousListIds listIds = new FeedServiceDto.PreviousListIds();
        listIds.setPreviousListIds(new ArrayList<Long>(){});
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", 2L);
        FollowMember followMember = FollowMember.builder()
                .followerMember(member)
                .followingId(memberId)
                .build();
        followMemberList.add(followMember);
        Feed feed = new Feed();
        ReflectionTestUtils.setField(feed, "feedId", 1L);
        ReflectionTestUtils.setField(feed, "member", member);
        List<Feed> pageDataList = List.of(feed);
        Page<Feed> pageFeed = new PageImpl<>(pageDataList);
        List<Feed> feedList = List.of(feed);
        MemberDto.Info memberInfo = MemberDto.Info.builder().memberId(1L).build();
        List<FeedImage> feedImageList = new ArrayList<>();
        Image image = new Image();
        ReflectionTestUtils.setField(image, "imageId", 1L);
        FeedImage feedImage = FeedImage.builder().image(image).feed(feed).build();
        feedImageList.add(feedImage);
        ImageDto imageDto = ImageDto.builder().imageId(image.getImageId()).build();
        List<ImageDto> imageDtoList = List.of(imageDto);
        FeedDto.Response response = FeedDto.Response.builder()
                .feedId(1L)
                .memberInfo(memberInfo)
                .images(imageDtoList)
                .build();

        given(followMemberRepository.findByFollowingId(Mockito.anyLong())).willReturn(Optional.of(followMemberList));
        given(feedRepository.findAllByMemberOrderByCreatedAtDesc(Mockito.any(Member.class),Mockito.any(PageRequest.class))).willReturn(pageFeed);

        given(feedMapper.FeedToFeedDtoResponse(Mockito.any(Feed.class))).willReturn(response);
        given(feedCommentsRepository.findByFeedFeedId(Mockito.anyLong())).willReturn(Optional.empty());
        given(feedImageRepository.findByFeed(Mockito.any(Feed.class))).willReturn(feedImageList);
        given(feedMapper.imageToImageDto(Mockito.any(Image.class))).willReturn(imageDto);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));

        FeedDtoList result = feedService.getFeedsByMemberFollow(memberId, 0, 10);

        assertEquals(result.getResponseList().size(), 1);
    }

    @Test
    @DisplayName("피드 수정 성공")
    void patchFeedSuccess() throws IOException {
        long memberId = 1L;
        Member member = new Member();
        List<MultipartFile> multipartFiles = new ArrayList<>();
        List<String> deleteImageList = new ArrayList<>();
        FeedServiceDto.Patch patch = FeedServiceDto.Patch.builder()
                .feedId(1L)
                .content("content2")
                .addImages(multipartFiles)
                .deleteImages(deleteImageList)
                .build();
        ReflectionTestUtils.setField(member, "memberId", 1L);
        Feed feed = Feed.builder()
                .content("content")
                .member(member)
                .build();
        ReflectionTestUtils.setField(feed, "feedId", 1L);
        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(memberId)
                .build();

        List<FeedImage> feedImageList = new ArrayList<>();
        Image image = new Image();
        ReflectionTestUtils.setField(image, "imageId", 1L);
        FeedImage feedImage = FeedImage.builder().image(image).feed(feed).build();
        feedImageList.add(feedImage);
        List<ImageDto> imageDtoList = new ArrayList<>();
        ImageDto imageDto = ImageDto.builder().imageId(image.getImageId()).build();
        imageDtoList.add(imageDto);
        FeedDto.Response response = FeedDto.Response.builder()
                .feedId(feed.getFeedId())
                .memberInfo(memberInfo)
                .content(patch.getContent())
                .images(imageDtoList)
                .build();

        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feed));

        given(feedMapper.FeedToFeedDtoResponse(Mockito.any(Feed.class))).willReturn(response);
        given(feedCommentsRepository.findByFeedFeedId(Mockito.anyLong())).willReturn(Optional.empty());
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(feedImageRepository.findByFeed(Mockito.any(Feed.class))).willReturn(feedImageList);
        given(feedMapper.imageToImageDto(Mockito.any(Image.class))).willReturn(imageDto);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(feedLikeRepository.findByMemberAndFeed(Mockito.any(Member.class), Mockito.any(Feed.class))).willReturn(Optional.empty());

        FeedDto.Response result = feedService.patchFeed(patch, memberId);

        assertEquals(result.getContent(), "content2");

    }

    @Test
    @DisplayName("피드 수정 실패 - 수정할 권한이 없습니다.")
    void patchFeedFails() {
        long memberId = 1L;
        Member member = new Member();
        FeedServiceDto.Patch patch = FeedServiceDto.Patch.builder().feedId(1L).build();
        ReflectionTestUtils.setField(member, "memberId", 2L);
        Feed feed = Feed.builder()
                .content("content")
                .member(member)
                .build();
        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feed));
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> feedService.patchFeed(patch, memberId));

        assertEquals(exception.getMessage(), "수정할 권한이 없습니다.");
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
        long feedId = 1L;
        long memberId = 1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        Feed feed =  new Feed();
        ReflectionTestUtils.setField(feed, "feedId", feedId);
        ReflectionTestUtils.setField(feed, "member", member);
        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feed));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());

        // when
        RuntimeException exception = assertThrows(RuntimeException.class, () -> feedService.deleteFeed(feedId, memberId));

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
    @DisplayName("피드 좋아요 성공 - 좋아요 등록")
    void likeByMemberSuccess_Like() {
        long memberId = 1L;
        long feedId = 1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        Feed feed = Feed.builder()
                .content("content")
                .member(member)
                .build();
        ReflectionTestUtils.setField(feed, "feedId", feedId);
        FeedLike feedLike = FeedLike.builder()
                .feed(feed)
                .member(member)
                .build();
        ReflectionTestUtils.setField(feedLike, "feedLikeId", 1L);
        ReflectionTestUtils.setField(feedLike, "isLike", true);

        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feed));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(feedLikeRepository.findByMemberAndFeed(Mockito.any(Member.class), Mockito.any(Feed.class))).willReturn(Optional.empty());
        given(feedLikeRepository.save(Mockito.any(FeedLike.class))).willReturn(feedLike);
        given(feedRepository.save(Mockito.any(Feed.class))).willReturn(feed);

        // when
        FeedDto.Like feedDtoLike = feedService.likeByMember(feedId, memberId);

        // then
        assertEquals(feedDtoLike.getLikeCount(), 1);
        assertTrue(feedDtoLike.isLike());
    }

    @Test
    @DisplayName("피드 좋아요 성공 - 좋아요 해제")
    void likeByMemberSuccess_UnLike() {
        long memberId = 1L;
        long feedId = 1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        Feed feed = Feed.builder()
                .content("content")
                .member(member)
                .build();
        ReflectionTestUtils.setField(feed, "feedId", feedId);
        ReflectionTestUtils.setField(feed, "likes", 1);
        FeedLike feedLike = FeedLike.builder()
                .feed(feed)
                .member(member)
                .build();
        ReflectionTestUtils.setField(feedLike, "feedLikeId", 1L);
        ReflectionTestUtils.setField(feedLike, "isLike", true);

        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feed));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(feedLikeRepository.findByMemberAndFeed(Mockito.any(Member.class), Mockito.any(Feed.class))).willReturn(Optional.of(feedLike));
        given(feedLikeRepository.save(Mockito.any(FeedLike.class))).willReturn(feedLike);
        given(feedRepository.save(Mockito.any(Feed.class))).willReturn(feed);

        // when
        FeedDto.Like feedDtoLike = feedService.likeByMember(feedId, memberId);

        // then
        assertEquals(feedDtoLike.getLikeCount(), 0);
        assertFalse(feedDtoLike.isLike());
    }

    @Test
    @DisplayName("피드 좋아요 실패 - 피드를 찾을 수 없음.")
    void likeByMemberFailsWhenFeedNotFound() {
        long memberId = 1L;
        long feedId = 1L;
        Feed feed = new Feed();
        Member member = new Member();
        FeedLike feedLike = FeedLike.builder()
                .feed(feed)
                .member(member)
                .build();
        ReflectionTestUtils.setField(feed, "feedId", feedId);
        ReflectionTestUtils.setField(member, "memberId", memberId);
        ReflectionTestUtils.setField(feedLike, "feedLikeId", 1L);

        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> feedService.likeByMember(feedId, memberId));

        assertEquals("피드를 찾을 수 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("피드 좋아요 실패 - 사용자를 찾을 수 없음.")
    void likeByMemberFailsWhenMemberNotFound() {
        long memberId = 1L;
        long feedId = 1L;
        Feed feed = new Feed();
        ReflectionTestUtils.setField(feed, "feedId", feedId);

        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feed));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> feedService.likeByMember(feedId, memberId));

        assertEquals("사용자를 찾을 수 없습니다.", exception.getMessage());
    }


}