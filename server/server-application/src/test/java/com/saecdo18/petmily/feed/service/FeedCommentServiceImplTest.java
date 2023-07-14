package com.saecdo18.petmily.feed.service;

import com.saecdo18.petmily.feed.dto.FeedCommentDto;
import com.saecdo18.petmily.feed.entity.Feed;
import com.saecdo18.petmily.feed.entity.FeedComments;
import com.saecdo18.petmily.feed.mapper.FeedMapper;
import com.saecdo18.petmily.feed.repository.FeedCommentsRepository;
import com.saecdo18.petmily.feed.repository.FeedRepository;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedCommentServiceImplTest {

    @Mock
    private FeedCommentsRepository feedCommentsRepository;
    @Mock
    private FeedRepository feedRepository;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private FeedMapper feedMapper;
    @InjectMocks
    private FeedCommentServiceImpl feedCommentService;

    @Test
    @DisplayName("댓글 생성 성공")
    void createCommentSuccess() {
        long memberId = 1L;
        FeedCommentDto.Post post = FeedCommentDto.Post.builder()
                .content("content")
                .feedId(1L)
                .build();

        Feed feed = new Feed();
        ReflectionTestUtils.setField(feed, "feedId", 1L);

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", 1L);

        FeedComments feedComments = FeedComments.builder()
                .content(post.getContent())
                .feed(feed)
                .member(member)
                .build();

        FeedCommentDto.Response response = FeedCommentDto.Response.builder()
                        .content(feedComments.getContent())
                        .feedCommentsId(1L)
                                .build();

        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feed));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        given(feedCommentsRepository.save(Mockito.any(FeedComments.class))).willReturn(feedComments);
        given(feedMapper.feedCommentsToFeedCommentDto(Mockito.any(FeedComments.class))).willReturn(response);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));

        FeedCommentDto.Response result = feedCommentService.createComment(post, memberId);

        assertSame(result, response);

    }

    @Test
    @DisplayName("댓글 생성 성공 - 피드백 받은 후 input, output 만 구현")
    void createCommentWithFeedback() {

    }

    @Test
    @DisplayName("댓글 생성 실패 - 피드를 찾을 수 없다.")
    void createCommentWhenFeedNotFound() {
        long memberId = 1L;
        FeedCommentDto.Post post = FeedCommentDto.Post.builder()
                .content("content")
                .feedId(1L)
                .build();

        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> feedCommentService.createComment(post, memberId));

        assertEquals(exception.getMessage(), "피드를 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("댓글 생성 실패 - 사용자를 찾을 수 없다.")
    void createCommentWhenMemberNotFound() {
        long memberId = 1L;
        FeedCommentDto.Post post = FeedCommentDto.Post.builder()
                .content("content")
                .feedId(1L)
                .build();

        Feed feed = new Feed();
        ReflectionTestUtils.setField(feed, "feedId", 1L);

        given(feedRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feed));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> feedCommentService.createComment(post, memberId));

        assertEquals(exception.getMessage(), "사용자를 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("댓글 수정 성공")
    void updateCommentSuccess() {
        long memberId = 1L;
        long commentId = 1L;
        FeedCommentDto.Patch patch = FeedCommentDto.Patch.builder()
                .content("수정")
                .feedId(1L)
                .build();
        Feed feed = new Feed();
        ReflectionTestUtils.setField(feed, "feedId", 1L);
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", 1L);
        FeedComments feedComments = FeedComments.builder()
                .feed(feed)
                .member(member)
                .content(patch.getContent())
                .build();

        FeedCommentDto.Response response = FeedCommentDto.Response.builder()
                .content(feedComments.getContent())
                .feedCommentsId(1L)
                .build();

        given(feedCommentsRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feedComments));
        given(feedCommentsRepository.save(Mockito.any(FeedComments.class))).willReturn(feedComments);
        given(feedMapper.feedCommentsToFeedCommentDto(Mockito.any(FeedComments.class))).willReturn(response);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));

        FeedCommentDto.Response result = feedCommentService.updateComment(patch,commentId, memberId);

        assertSame(result, response);

    }

    @Test
    @DisplayName("댓글 수정 실패 - 댓글을 찾을 수 없습니다.")
    void updateCommentFailsWhenCommentNotFound() {
        long memberId = 1L;
        long commentId = 1L;
        FeedCommentDto.Patch patch = FeedCommentDto.Patch.builder()
                .content("수정")
                .feedId(1L)
                .build();

        given(feedCommentsRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> feedCommentService.updateComment(patch, commentId, memberId));

        assertEquals(exception.getMessage(), "피드 댓글을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("댓글 수정 실패 - 수정할 권한이 없습니다.")
    void updateCommentFailsWhenNoAuthorizePatch() {
        long memberId = 1L;
        long commentId = 1L;
        FeedCommentDto.Patch patch = FeedCommentDto.Patch.builder()
                .content("수정")
                .feedId(1L)
                .build();
        Feed feed = new Feed();
        ReflectionTestUtils.setField(feed, "feedId", 1L);
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", 2L);
        FeedComments feedComments = FeedComments.builder()
                .feed(feed)
                .member(member)
                .build();

        given(feedCommentsRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feedComments));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> feedCommentService.updateComment(patch, commentId, memberId));

        assertEquals(exception.getMessage(), "수정할 권한이 없습니다.");

    }

    @Test
    @DisplayName("댓글 삭제 성공")
    void deleteCommentSuccess() {
        long memberId = 1L;
        long commentId = 1L;
        Feed feed = new Feed();
        ReflectionTestUtils.setField(feed, "feedId", 1L);
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", 1L);
        FeedComments feedComments = FeedComments.builder()
                .feed(feed)
                .member(member)
                .build();

        given(feedCommentsRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feedComments));
        doNothing().when(feedCommentsRepository).delete(feedComments);

        feedCommentService.deleteComment(commentId, memberId);

        verify(feedCommentsRepository, times(1)).findById(commentId);
        verify(feedCommentsRepository, times(1)).delete(feedComments);

    }

    @Test
    @DisplayName("댓글 삭제 실패 - 댓글을 찾을 수 없습니다.")
    void deleteCommentFailsWhenCommentNotFound() {
        long memberId = 1L;
        long commentId = 1L;
        FeedCommentDto.Patch patch = FeedCommentDto.Patch.builder()
                .content("삭제")
                .feedId(1L)
                .build();

        given(feedCommentsRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> feedCommentService.updateComment(patch, commentId, memberId));

        assertEquals(exception.getMessage(), "피드 댓글을 찾을 수 없습니다.");
    }


    @Test
    @DisplayName("댓글 삭제 실패 - 삭제할 권한이 없습니다.")
    void deleteCommentFailsWhenNoAuthorizeDelete() {
        long memberId = 1L;
        long commentId = 1L;
        Feed feed = new Feed();
        ReflectionTestUtils.setField(feed, "feedId", 1L);
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", 2L);
        FeedComments feedComments = FeedComments.builder()
                .feed(feed)
                .member(member)
                .build();

        given(feedCommentsRepository.findById(Mockito.anyLong())).willReturn(Optional.of(feedComments));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> feedCommentService.deleteComment(commentId, memberId));

        assertEquals(exception.getMessage(), "삭제할 권한이 없습니다.");
    }
}