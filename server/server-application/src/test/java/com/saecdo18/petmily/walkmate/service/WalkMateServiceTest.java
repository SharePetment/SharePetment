package com.saecdo18.petmily.walkmate.service;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.entity.WalkMateLike;
import com.saecdo18.petmily.walkmate.mapper.WalkMateMapper;
import com.saecdo18.petmily.walkmate.repository.WalkLikeRepository;
import com.saecdo18.petmily.walkmate.repository.WalkMateCommentRepository;
import com.saecdo18.petmily.walkmate.repository.WalkMateRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalkMateServiceTest {
    @Mock
    private WalkMateRepository walkMateRepository;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private WalkMateCommentService walkMateCommentService;
    @Mock
    private WalkMateMapper walkMateMapper;
    @Mock
    private WalkMateCommentRepository walkMateCommentRepository;
    @Mock
    private WalkLikeRepository walkLikeRepository;

    @InjectMocks
    private WalkMateService walkMateService;

    @Test
    @DisplayName("산책 게시글 등록 성공")
    void createWalkSuccess() throws Exception {

        long memberId = 1L;
        long walkId = 1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(memberId)
                .build();
        WalkMateDto.Response response = WalkMateDto.Response.builder()
                .walkMatePostId(walkMate.getWalkMatePostId())
                .title(walkMate.getTitle())
                .memberInfo(memberInfo)
                .build();

        given(walkMateRepository.save(Mockito.any(WalkMate.class))).willReturn(walkMate);
        given(walkMateMapper.walkMateToWalkMateResponseDto(Mockito.any(WalkMate.class))).willReturn(response);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));

        WalkMateDto.Response result = walkMateService.createWalk(walkMate, 1L);

        assertEquals(walkMate.getTitle(), result.getTitle());
        assertEquals(walkMate.getMember().getMemberId(), result.getMemberInfo().getMemberId());
    }

    @Test
    @DisplayName("산책 게시글 등록 실패 - 사용자를 찾을 수 없습니다.")
    void createWalkFailsWhenMemberNotFound() throws IOException {

        long memberId = 1L;
        long walkId = 1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateService.createWalk(walkMate, memberId));

        assertEquals(exception.getMessage(), "사용자를 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("산책 게시글 (게시글 ID로) 가져오기 성공")
    void getWalkByWalkIdSuccess(){

        long memberId = 1L;
        long walkId = 1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(memberId)
                .build();

        WalkMateDto.Response response = WalkMateDto.Response.builder()
                .walkMatePostId(walkMate.getWalkMatePostId())
                .title(walkMate.getTitle())
                .memberInfo(memberInfo)
                .build();

        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.of(walkMate));
        given(walkMateMapper.walkMateToWalkMateResponseDto(Mockito.any(WalkMate.class))).willReturn(response);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));

        WalkMateDto.Response result = walkMateService.findWalkByWalkId(walkId);

        assertEquals(walkMate.getTitle(), result.getTitle());
        assertEquals(walkMate.getWalkMatePostId(), result.getWalkMatePostId());
    }

    @Test
    @DisplayName("산책 게시글 (게시글 ID로) 가져오기 실패 - 산책 게시글을 찾을 수 없습니다.")
    void getWalkByWalkIdFailWhenWalkNotFound() throws IOException{

        long walkId=1L;
        long memberId=1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .member(member)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateService.findWalkByWalkId(walkId));
        assertEquals(exception.getMessage(), "산책 게시글을 찾을 수 없습니다.");

    }

    @Test
    @DisplayName("산책 게시글 (회원 ID로) 가져오기 성공")
    void getWalksByMemberIdSuccess(){

        long walkId=1L;
        long memberId=1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member)
                .open(true)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(memberId)
                .build();

        List<WalkMate> walkMateList = new ArrayList<>();
        walkMateList.add(walkMate);

        Pageable pageable = Mockito.mock(Pageable.class);
        Page<WalkMate> walkMatePage = new PageImpl<>(walkMateList, pageable, walkMateList.size());

        List<WalkMateDto.Response> responseList = new ArrayList<>();
        WalkMateDto.Response response = WalkMateDto.Response.builder()
                .walkMatePostId(walkMate.getWalkMatePostId())
                .memberInfo(memberInfo)
                .title(walkMate.getTitle())
                .open(walkMate.getOpen())
                .build();

        responseList.add(response);

        given(walkMateMapper.walkMateToWalkMateResponseDto(Mockito.any(WalkMate.class))).willReturn(response);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(walkMateRepository.findByMember(Mockito.any(Pageable.class), Mockito.any(Member.class))).willReturn(walkMatePage);

        List<WalkMateDto.Response> result = walkMateService.findWalksByMemberId(0, 10, memberId, response.getOpen());

        assertEquals(result.get(0).getWalkMatePostId(), responseList.get(0).getWalkMatePostId());
        assertEquals(result.get(0).getTitle(), responseList.get(0).getTitle());
        assertEquals(result.get(0).getMemberInfo().getMemberId(), responseList.get(0).getMemberInfo().getMemberId());
    }

    @Test
    @DisplayName("산책 게시글 (회원 ID로) 가져오기 실패 - 사용자를 찾을 수 없습니다.")
    void getWalksByMemberIdFailWhenMemberNotFound() throws IOException{

        long walkId=1L;
        long memberId=1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member)
                .open(true)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(memberId)
                .build();

        List<WalkMate> walkMateList = new ArrayList<>();
        walkMateList.add(walkMate);

        List<WalkMateDto.Response> responseList = new ArrayList<>();
        WalkMateDto.Response response = WalkMateDto.Response.builder()
                .walkMatePostId(walkMate.getWalkMatePostId())
                .memberInfo(memberInfo)
                .title(walkMate.getTitle())
                .open(walkMate.getOpen())
                .build();

        responseList.add(response);

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateService.findWalksByMemberId(0, 10, memberId, response.getOpen()));
        assertEquals(exception.getMessage(), "사용자를 찾을 수 없습니다.");

    }

    @Test
    @DisplayName("산책 게시글 (본인이 댓글단) 가져오기 성공")
    void getWalksByCommentedSuccess(){

        long walkId=1L;
        long postMemberId=1L;
        long commentMemberId=2L;

        Member postMember = new Member();
        ReflectionTestUtils.setField(postMember, "memberId", postMemberId);

        Member commentMember = new Member();
        ReflectionTestUtils.setField(commentMember, "memberId", commentMemberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(postMember)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .member(commentMember)
                .content("댓글1")
                .build();

        MemberDto.Info postMemberInfo = MemberDto.Info.builder()
                .memberId(postMemberId)
                .build();

        MemberDto.Info commentMemberInfo = MemberDto.Info.builder()
                .memberId(commentMemberId)
                .build();


        List<WalkMateDto.Response> responseList = new ArrayList<>();

        List<WalkMateComment> commentList = new ArrayList<>();
        commentList.add(comment);

        WalkMateCommentDto.Response commentResponse = WalkMateCommentDto.Response.builder()
                .content(comment.getContent())
                .walkMatePostId(comment.getWalkMate().getWalkMatePostId())
                .walkMateCommentId(comment.getWalkMateCommentId())
                .memberInfo(commentMemberInfo)
                .build();

        List<WalkMateCommentDto.Response> commentResponseDtoList = new ArrayList<>();
        commentResponseDtoList.add(commentResponse);

        WalkMateDto.Response response = WalkMateDto.Response.builder()
                .walkMatePostId(walkMate.getWalkMatePostId())
                .memberInfo(postMemberInfo)
                .title(walkMate.getTitle())
                .comments(commentResponseDtoList)
                .build();

        responseList.add(response);

        given(walkMateMapper.walkMateToWalkMateResponseDto(Mockito.any(WalkMate.class))).willReturn(response);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(Mockito.mock(Member.class)));
        given(walkMateCommentRepository.findAll()).willReturn(commentList);

        List<WalkMateDto.Response> result = walkMateService.findCommentedWalks(commentMemberId);

        assertEquals(result.get(0).getComments().get(0).getWalkMateCommentId(), comment.getWalkMateCommentId());
        assertEquals(result.get(0).getComments().get(0).getContent(), comment.getContent());
        assertEquals(result.get(0).getComments().get(0).getMemberInfo().getMemberId(), comment.getMember().getMemberId());

    }

    @Test
    @DisplayName("산책 게시글 (본인이 댓글단) 가져오기 실패 - 사용자를 찾을 수 없습니다.")
    void getWalksByCommentedFailWhenMemberNotFound() throws IOException{

        long walkId=1L;
        long postMemberId=1L;
        long commentMemberId=2L;

        Member postMember = new Member();
        ReflectionTestUtils.setField(postMember, "memberId", postMemberId);

        Member commentMember = new Member();
        ReflectionTestUtils.setField(commentMember, "memberId", commentMemberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(postMember)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .member(commentMember)
                .content("댓글1")
                .build();

        MemberDto.Info postMemberInfo = MemberDto.Info.builder()
                .memberId(postMemberId)
                .build();

        MemberDto.Info commentMemberInfo = MemberDto.Info.builder()
                .memberId(commentMemberId)
                .build();


        List<WalkMateDto.Response> responseList = new ArrayList<>();

        List<WalkMateComment> commentList = new ArrayList<>();
        commentList.add(comment);

        WalkMateCommentDto.Response commentResponse = WalkMateCommentDto.Response.builder()
                .content(comment.getContent())
                .walkMatePostId(comment.getWalkMate().getWalkMatePostId())
                .walkMateCommentId(comment.getWalkMateCommentId())
                .memberInfo(commentMemberInfo)
                .build();

        List<WalkMateCommentDto.Response> commentResponseDtoList = new ArrayList<>();
        commentResponseDtoList.add(commentResponse);

        WalkMateDto.Response response = WalkMateDto.Response.builder()
                .walkMatePostId(walkMate.getWalkMatePostId())
                .memberInfo(postMemberInfo)
                .title(walkMate.getTitle())
                .comments(commentResponseDtoList)
                .build();

        responseList.add(response);

        List<WalkMateDto.Response> result = walkMateService.findCommentedWalks(commentMemberId);
        assertNotNull(result);

    }

    @Test
    @DisplayName("산책 게시글 수정 성공")
    void updateWalkMateSuccess(){

        long walkId=1L;
        long memberId=1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목")
                .open(true)
                .member(member)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(memberId)
                .build();

        WalkMateDto.Response response = WalkMateDto.Response.builder()
                .walkMatePostId(walkId)
                .title("제목 수정")
                .open(false)
                .memberInfo(memberInfo)
                .build();

        WalkMateDto.Patch patch = WalkMateDto.Patch.builder()
                .title("제목 수정")
                .open(false)
                .build();

        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.of(walkMate));
        given(walkMateMapper.walkMateToWalkMateResponseDto(Mockito.any(WalkMate.class))).willReturn(response);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));

        WalkMateDto.Response result = walkMateService.updateWalkMate(patch, walkId, memberId);

        assertEquals(response.getTitle(), result.getTitle());
        assertEquals(response.getOpen(), result.getOpen());
    }

    @Test
    @DisplayName("산책 게시글 수정 실패 - 산책 게시글을 찾을 수 없습니다.")
    void updateWalkMateFailWhenWalkNotFound() throws IOException{

        long walkId=1L;
        long memberId=1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .member(member)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateDto.Patch patch = WalkMateDto.Patch.builder()
                .title("제목 수정")
                .open(false)
                .build();

        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateService.updateWalkMate(patch, walkId, memberId));
        assertEquals(exception.getMessage(), "산책 게시글을 찾을 수 없습니다.");

    }

    @Test
    @DisplayName("지역별 산책 게시글 페이지별 조회 성공")
    void getRecentPageSuccess() {

        long walkId=1L;
        long memberId=1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member)
                .location("서울시 마포구 서교동")
                .open(true)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(memberId)
                .build();

        List<WalkMate> walkMateList = new ArrayList<>();
        walkMateList.add(walkMate);

        Pageable pageable = Mockito.mock(Pageable.class);
        Page<WalkMate> walkMatePage = new PageImpl<>(walkMateList, pageable, walkMateList.size());

        List<WalkMateDto.Response> responseList = new ArrayList<>();
        WalkMateDto.Response response = WalkMateDto.Response.builder()
                .walkMatePostId(walkMate.getWalkMatePostId())
                .memberInfo(memberInfo)
                .title(walkMate.getTitle())
                .location(walkMate.getLocation())
                .open(walkMate.getOpen())
                .build();

        responseList.add(response);

        given(walkMateMapper.walkMateToWalkMateResponseDto(Mockito.any(WalkMate.class))).willReturn(response);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(walkMateRepository.findByLocationContaining(Mockito.any(Pageable.class), Mockito.anyString())).willReturn(walkMatePage);

        List<WalkMateDto.Response> result = walkMateService.recentPage(0, 10, response.getLocation(), response.getOpen());

        assertEquals(result.get(0).getWalkMatePostId(), responseList.get(0).getWalkMatePostId());
        assertEquals(result.get(0).getLocation(), responseList.get(0).getLocation());
        assertEquals(result.get(0).getMemberInfo().getMemberId(), responseList.get(0).getMemberInfo().getMemberId());
        assertEquals(result.get(0).getOpen(), responseList.get(0).getOpen());

    }

    @Test
    @DisplayName("지역별 산책 게시글 페이지별 조회 실패 - 사용자를 찾을 수 없습니다.")
    void getRecentPageFailWhenMemberNotFound() throws IOException{

        long walkId=1L;
        long memberId=1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member)
                .location("서울시 마포구 서교동")
                .open(true)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(memberId)
                .build();

        List<WalkMate> walkMateList = new ArrayList<>();
        walkMateList.add(walkMate);

        Pageable pageable = Mockito.mock(Pageable.class);
        Page<WalkMate> walkMatePage = new PageImpl<>(walkMateList, pageable, walkMateList.size());

        List<WalkMateDto.Response> responseList = new ArrayList<>();
        WalkMateDto.Response response = WalkMateDto.Response.builder()
                .walkMatePostId(walkMate.getWalkMatePostId())
                .memberInfo(memberInfo)
                .title(walkMate.getTitle())
                .location(walkMate.getLocation())
                .open(walkMate.getOpen())
                .build();

        responseList.add(response);

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        given(walkMateRepository.findByLocationContaining(Mockito.any(Pageable.class), Mockito.anyString())).willReturn(walkMatePage);
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateService.recentPage(0, 10, responseList.get(0).getLocation(), responseList.get(0).getOpen()));
        assertEquals(exception.getMessage(), "사용자를 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("산책 게시글 삭제 성공")
    void deleteWalkSuccess() {

        long walkId=1L;
        long memberId=1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member)
                .location("서울시 마포구 서교동")
                .open(true)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMateComment comment = WalkMateComment.builder()
                .walkMate(walkMate)
                .member(member)
                .content("댓글1")
                .build();

        List<WalkMateComment> commentList = new ArrayList<>();
        commentList.add(comment);

        walkMate.setComments(commentList);

        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.of(walkMate));
        doNothing().when(walkMateRepository).delete(walkMate);
        doNothing().when(walkMateCommentRepository).delete(comment);

        walkMateService.deleteWalk(walkId, memberId);

        verify(walkMateRepository, times(1)).delete(walkMate);
    }

    @Test
    @DisplayName("산책 게시글 삭제 실패 - 산책 게시글을 찾을 수 없습니다.")
    void deleteWalkFailWhenWalkNotFound() throws IOException{

        long walkId=1L;
        long memberId=1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .title("제목1")
                .member(member)
                .location("서울시 마포구 서교동")
                .open(true)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateService.deleteWalk(walkId, memberId));
        assertEquals(exception.getMessage(), "산책 게시글을 찾을 수 없습니다.");

    }

    @Test
    @DisplayName("산책 게시글 모집 여부 수정 성공")
    void changeOpenStatusSuccess() {

        long memberId = 1L;
        long walkId = 1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .open(true)
                .member(member)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        given(walkMateRepository.save(Mockito.any(WalkMate.class))).willReturn(walkMate);
        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.of(walkMate));

        WalkMateDto.Open result = walkMateService.changeOpenStatus(false, 1L, 1L);

        assertEquals(walkMate.getOpen(), result.getOpen());
    }

    @Test
    @DisplayName("산책 게시글 모집 여부 수정 실패 - 수정할 권한이 없습니다.")
    void changeOpenStatusFailWhenNoPermission(){

        long memberId = 1L;
        long walkId = 1L;
        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        WalkMate walkMate = WalkMate.builder()
                .open(true)
                .member(member)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.of(walkMate));
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateService.changeOpenStatus(anyBoolean(), walkId, 2L));
        assertEquals(exception.getMessage(), "수정할 권한이 없습니다.");

    }

    @Test
    @DisplayName("산책 게시글 좋아요 성공")
    void likeByMemberSuccess(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        WalkMate walkMate = WalkMate.builder()
                .member(member1)
                .likeCount(0)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        WalkMate savedWalk = WalkMate.builder()
                .member(walkMate.getMember())
                .likeCount(1)
                .build();

        WalkMateLike walkMateLike = WalkMateLike.builder()
                .member(savedWalk.getMember())
                .walk(savedWalk)
                .build();

        WalkMateDto.Like response = WalkMateDto.Like.builder()
                .isLike(true)
                .likeCount(1)
                .build();

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member2));
        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.of(walkMate));
        given(walkMateRepository.save(Mockito.any())).willReturn(savedWalk);
        given(walkLikeRepository.save(Mockito.any())).willReturn(walkMateLike);

        WalkMateDto.Like result = walkMateService.likeByMember(walkId, member2Id);

        assertEquals(response.getLikeCount(), result.getLikeCount());
        assertEquals(response.isLike(), response.isLike());
    }

    @Test
    @DisplayName("산책 게시글 좋아요 실패 - 산책 게시글을 찾을 수 없습니다.")
    void likeByMemberFailWhenWalkNotFound(){

        long member1Id = 1L;
        long member2Id = 2L;
        long walkId = 1L;
        Member member1 = new Member();
        ReflectionTestUtils.setField(member1, "memberId", member1Id);

        Member member2 = new Member();
        ReflectionTestUtils.setField(member2, "memberId", member2Id);

        WalkMate walkMate = WalkMate.builder()
                .member(member1)
                .likeCount(0)
                .build();
        ReflectionTestUtils.setField(walkMate, "walkMatePostId", walkId);

        given(walkMateRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, ()->walkMateService.likeByMember(walkId, member2Id));
        assertEquals(exception.getMessage(), "산책 게시글을 찾을 수 없습니다.");
    }









}
