package com.saecdo18.petmily.walkmate.service;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.mapper.WalkMateCommentMapper;
import com.saecdo18.petmily.walkmate.mapper.WalkMateMapper;
import com.saecdo18.petmily.walkmate.repository.WalkLikeRepository;
import com.saecdo18.petmily.walkmate.repository.WalkMateCommentRepository;
import com.saecdo18.petmily.walkmate.repository.WalkMateRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalkMateCommentServiceTest {

    @Mock
    private WalkMateRepository walkMateRepository;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private WalkMateMapper walkMateMapper;
    @Mock
    private WalkMateCommentMapper walkMateCommentMapper;
    @Mock
    private WalkMateCommentRepository walkMateCommentRepository;
    @Mock
    private WalkLikeRepository walkLikeRepository;

    @InjectMocks
    private WalkMateCommentService walkMateCommentService;

    @Test
    @DisplayName("산책 게시글 댓글 등록 성공")
    void createCommentsSuccess(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member1Id);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("내용1")
                .member(member2)
                .build();

        WalkMateCommentDto.Post post = WalkMateCommentDto.Post.builder()
                .content(comment.getContent())
                .build();

        WalkMateCommentDto.Response response = WalkMateCommentDto.Response.builder()
                .walkMateCommentId(commentId)
                .content(post.getContent())
                .build();

        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.of(walkMate));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member2));
        given(walkMateCommentRepository.save(Mockito.any(WalkMateComment.class))).willReturn(comment);
        given(walkMateCommentMapper.commentToCommentResponseDto(Mockito.any(WalkMateComment.class))).willReturn(response);

        WalkMateCommentDto.Response result = walkMateCommentService.createComments(post, walkId, commentId);

        assertEquals(response.getContent(), result.getContent());
    }

    @Test
    @DisplayName("산책 게시글 댓글 등록 실패 - 산책 게시글을 찾을 수 없습니다.")
    void createCommentsFailWhenWalkNotFound(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member1Id);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("내용1")
                .member(member2)
                .build();

        WalkMateCommentDto.Post post = WalkMateCommentDto.Post.builder()
                .content(comment.getContent())
                .build();

        WalkMateCommentDto.Response response = WalkMateCommentDto.Response.builder()
                .walkMateCommentId(commentId)
                .content(post.getContent())
                .build();

        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateCommentService.createComments(post, walkId, member2Id));
        assertEquals(exception.getMessage(), "산책 게시글을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("산책 게시글 댓글 조회(댓글 ID를 통한) 성공")
    void findCommentSuccess(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("내용1")
                .member(member2)
                .build();

        WalkMateCommentDto.Post post = WalkMateCommentDto.Post.builder()
                .content(comment.getContent())
                .build();

        WalkMateCommentDto.Response response = WalkMateCommentDto.Response.builder()
                .walkMateCommentId(commentId)
                .content(post.getContent())
                .build();

        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member2));
        given(walkMateCommentRepository.findById(Mockito.anyLong())).willReturn(Optional.of(comment));
        given(walkMateCommentMapper.commentToCommentResponseDto(Mockito.any(WalkMateComment.class))).willReturn(response);

        WalkMateCommentDto.Response result = walkMateCommentService.findComment(commentId);

        assertEquals(response.getContent(), result.getContent());
    }

    @Test
    @DisplayName("산책 게시글 댓글 조회(댓글 ID를 통한) 실패 - 댓글을 찾을 수 없습니다.")
    void findCommentFailWhenCommentNotFound(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("내용1")
                .member(member2)
                .build();

        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        given(walkMateCommentRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateCommentService.findComment(commentId));
        assertEquals(exception.getMessage(), "댓글을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("산책 게시글 댓글 조회(산책 게시글 ID를 통한) 성공")
    void findCommentsByWalkIdSuccess(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        MemberDto.Info info = MemberDto.Info.builder()
                .memberId(member2Id)
                .build();

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("내용1")
                .member(member2)
                .build();
        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        WalkMateCommentDto.Response oneResponse = WalkMateCommentDto.Response.builder()
                .content(comment.getContent())
                .memberInfo(info)
                .walkMatePostId(comment.getWalkMate().getWalkMatePostId())
                .build();

        List<WalkMateComment> commentList = new ArrayList<>();
        commentList.add(comment);

        List<WalkMateCommentDto.Response> response = new ArrayList<>();
        response.add(oneResponse);

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member2));
        given(walkMateCommentRepository.findById(Mockito.anyLong())).willReturn(Optional.of(comment));
        given(walkMateCommentRepository.findAll()).willReturn(commentList);
        given(walkMateCommentMapper.commentToCommentResponseDto(Mockito.any())).willReturn(oneResponse);

        List<WalkMateCommentDto.Response> result = walkMateCommentService.findCommentsByWalkId(walkId);

        assertEquals(response.get(0).getContent(), result.get(0).getContent());
    }

    @Test
    @DisplayName("산책 게시글 댓글 조회(산책 게시글 ID를 통한) 실패 - 댓글을 찾을 수 없습니다.")
    void findCommentsByWalkIdFailWhenWalkNotFound(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        MemberDto.Info info = MemberDto.Info.builder()
                .memberId(member2Id)
                .build();

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("내용1")
                .member(member2)
                .build();
        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        WalkMateCommentDto.Response oneResponse = WalkMateCommentDto.Response.builder()
                .content(comment.getContent())
                .memberInfo(info)
                .walkMatePostId(comment.getWalkMate().getWalkMatePostId())
                .build();

        List<WalkMateComment> commentList = new ArrayList<>();
        commentList.add(comment);

        List<WalkMateCommentDto.Response> response = new ArrayList<>();
        response.add(oneResponse);

        given(walkMateCommentRepository.findAll()).willReturn(commentList);
        given(walkMateCommentRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateCommentService.findCommentsByWalkId(walkId));
        assertEquals(exception.getMessage(), "댓글을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("산책 게시글 조회(회원 ID를 통한) 성공")
    void findCommentsByMemberIdSuccess(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        MemberDto.Info info = MemberDto.Info.builder()
                .memberId(member2Id)
                .build();

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("내용1")
                .member(member2)
                .build();
        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        WalkMateCommentDto.Response oneResponse = WalkMateCommentDto.Response.builder()
                .content(comment.getContent())
                .memberInfo(info)
                .walkMatePostId(comment.getWalkMate().getWalkMatePostId())
                .build();

        List<WalkMateComment> commentList = new ArrayList<>();
        commentList.add(comment);

        List<WalkMateCommentDto.Response> response = new ArrayList<>();
        response.add(oneResponse);

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member2));
        given(walkMateCommentRepository.findById(Mockito.anyLong())).willReturn(Optional.of(comment));
        given(walkMateCommentRepository.findAll()).willReturn(commentList);
        given(walkMateCommentMapper.commentToCommentResponseDto(Mockito.any())).willReturn(oneResponse);

        List<WalkMateCommentDto.Response> result = walkMateCommentService.findCommentsByMemberId(member2Id);

        assertEquals(response.get(0).getMemberInfo().getMemberId(), result.get(0).getMemberInfo().getMemberId());

    }

    @Test
    @DisplayName("산책 게시글 조회(회원 ID를 통한) 실패 - 댓글을 찾을 수 없습니다.")
    void findCommentsByMemberIdFailWhenCommentNotFound(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        MemberDto.Info info = MemberDto.Info.builder()
                .memberId(member2Id)
                .build();

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("내용1")
                .member(member2)
                .build();
        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        WalkMateCommentDto.Response oneResponse = WalkMateCommentDto.Response.builder()
                .content(comment.getContent())
                .memberInfo(info)
                .walkMatePostId(comment.getWalkMate().getWalkMatePostId())
                .build();

        List<WalkMateComment> commentList = new ArrayList<>();
        commentList.add(comment);

        List<WalkMateCommentDto.Response> response = new ArrayList<>();
        response.add(oneResponse);

        given(walkMateCommentRepository.findAll()).willReturn(commentList);
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateCommentService.findCommentsByMemberId(member2Id));
        assertEquals(exception.getMessage(), "댓글을 찾을 수 없습니다.");

    }

    @Test
    @DisplayName("산책 게시글 댓글 수정 성공")
    void updateCommentsSuccess(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("댓글")
                .member(member2)
                .build();

        WalkMateCommentDto.Patch patch = WalkMateCommentDto.Patch.builder()
                .content("댓글 수정")
                .build();

        WalkMateCommentDto.Response response = WalkMateCommentDto.Response.builder()
                .walkMateCommentId(commentId)
                .content(patch.getContent())
                .build();

        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member2));
        given(walkMateCommentRepository.findById(Mockito.anyLong())).willReturn(Optional.of(comment));
        given(walkMateCommentMapper.commentToCommentResponseDto(Mockito.any(WalkMateComment.class))).willReturn(response);
        WalkMateCommentDto.Response result = walkMateCommentService.updateComment(patch, walkId, member2Id);

        assertEquals(response.getContent(), result.getContent());
    }

    @Test
    @DisplayName("산책 게시글 댓글 수정 실패 - 댓글을 찾을 수 없습니다.")
    void updateCommentsFailWhenWalkNotFound(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("댓글")
                .member(member2)
                .build();
        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        WalkMateCommentDto.Patch patch = WalkMateCommentDto.Patch.builder()
                .content("댓글 수정")
                .build();

        given(walkMateCommentRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateCommentService.updateComment(patch, commentId, member2Id));
        assertEquals(exception.getMessage(), "댓글을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("산책 게시글 댓글 삭제 성공")
    void deleteCommentSuccess(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("댓글")
                .member(member2)
                .build();
        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        given(walkMateCommentRepository.findById(Mockito.anyLong())).willReturn(Optional.of(comment));
        doNothing().when(walkMateCommentRepository).delete(comment);

        walkMateCommentService.deleteComment(commentId, member2Id);

        verify(walkMateCommentRepository, times(1)).delete(comment);

    }

    @Test
    @DisplayName("산책 게시글 댓글 삭제 실패 - 삭제할 권한이 없습니다.")
    void deleteCommentFailWhenNoPermission(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        long commentId = 1L;

        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member1)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .content("댓글")
                .member(member2)
                .build();
        ReflectionTestUtils.setField(comment, "walkMateCommentId", commentId);

        given(walkMateCommentRepository.findById(Mockito.anyLong())).willReturn(Optional.of(comment));
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateCommentService.deleteComment(commentId, 3L));
        assertEquals(exception.getMessage(), "삭제할 권한이 없습니다.");

    }














}
