package com.saecdo18.petmily.walkmate.service;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.mapper.WalkMateCommentMapper;
import com.saecdo18.petmily.walkmate.repository.WalkMateCommentRepository;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.repository.WalkMateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WalkMateCommentService {

    private final WalkMateCommentRepository walkMateCommentRepository;
    private final WalkMateRepository walkMateRepository;
    private final MemberRepository memberRepository;
    private final WalkMateCommentMapper walkMateCommentMapper;

    public WalkMateCommentService(WalkMateCommentRepository walkMateCommentRepository, WalkMateRepository walkMateRepository,
                                  MemberRepository memberRepository, WalkMateCommentMapper walkMateCommentMapper) {
        this.walkMateCommentRepository = walkMateCommentRepository;
        this.walkMateRepository = walkMateRepository;
        this.memberRepository = memberRepository;
        this.walkMateCommentMapper = walkMateCommentMapper;
    }

    public WalkMateCommentDto.Response createComments(WalkMateCommentDto.Post commentPostDto, long walkId, long memberId){

        WalkMate walk = methodFindByWalkId(walkId);
        Member member = methodFindByMemberId(memberId);

        WalkMateComment saveComment = WalkMateComment.builder()
                .walkMate(walk)
                .member(member)
                .content(commentPostDto.getContent())
                .likes(0)
                .build();

        WalkMateComment savedComment = walkMateCommentRepository.save(saveComment);
        MemberDto.Info info = getMemberInfoByComment(savedComment);

        WalkMateCommentDto.Response response = walkMateCommentMapper.commentToCommentResponseDto(savedComment);
        response.setMemberInfo(info);



        return response;
    }

    public WalkMateComment findComments(long commentId){

        Optional<WalkMateComment> optionalWalkMateComment = walkMateCommentRepository.findById(commentId);
        WalkMateComment findComment = optionalWalkMateComment.orElseThrow();

        return findComment;
    }

    public WalkMateCommentDto.Response findComment(long commentId){

        WalkMateComment comment = walkMateCommentRepository.findById(commentId).orElseThrow();
        WalkMateCommentDto.Response response = walkMateCommentMapper.commentToCommentResponseDto(comment);

        Member member = methodFindByMemberId(comment.getMember().getMemberId());
        MemberDto.Info info = MemberDto.Info.builder()
                .memberId(member.getMemberId())
                .imageURL(member.getImageURL())
                .nickname(member.getNickname())
                .build();
        response.setMemberInfo(info);

        return response;
    }

    public List<WalkMateCommentDto.Response> findAllComments(){

        List<WalkMateComment> allComments = walkMateCommentRepository.findAll();
        List<WalkMateCommentDto.Response> response = getResponseListFromCommentList(allComments);

        return response;
    }

    public List<WalkMateCommentDto.Response> findCommentsByWalkId(long walkId){

        List<WalkMateComment> allComments = walkMateCommentRepository.findAll();
        List<WalkMateComment> findComments = allComments.stream()
                .filter(comment -> comment.getWalkMate().getWalkMatePostId()==walkId)
                .collect(Collectors.toList());

        List<WalkMateCommentDto.Response> response = getResponseListFromCommentList(findComments);

        return response;
    }

    private List<WalkMateCommentDto.Response> getResponseListFromCommentList(List<WalkMateComment> findComments) {
        List<WalkMateCommentDto.Response> response =
                findComments.stream()
                        .map(comment -> findComment(comment.getWalkMateCommentId()))
                        .collect(Collectors.toList());
        return response;
    }

    public List<WalkMateCommentDto.Response> findCommentsByMemberId(long memberId){

        List<WalkMateComment> allComments = walkMateCommentRepository.findAll();
        List<WalkMateComment> findComments = allComments.stream()
                .filter(comment -> comment.getMember().getMemberId()==memberId)
                .collect(Collectors.toList());

        List<WalkMateCommentDto.Response> response = getResponseListFromCommentList(findComments);

        return response;
    }

    public WalkMateCommentDto.Response updateComment(WalkMateCommentDto.Patch commentPatchDto, long commentId, long memberId){

        WalkMateComment findComment = walkMateCommentRepository.findById(commentId).orElseThrow();

        if(memberId!=findComment.getMember().getMemberId()){
            throw new IllegalArgumentException("수정할 권한이 없습니다.");
        }

        findComment.setContent(commentPatchDto.getContent());
        walkMateCommentRepository.save(findComment);

        MemberDto.Info info = getMemberInfoByComment(findComment);

        WalkMateCommentDto.Response response = walkMateCommentMapper.commentToCommentResponseDto(findComment);
        response.setMemberInfo(info);

        return response;
    }

    public void deleteComment(long commentId, long memberId){

        WalkMateComment findComment = walkMateCommentRepository.findById(commentId).orElseThrow();

        if(memberId!=findComment.getMember().getMemberId()){
            throw new IllegalArgumentException("삭제할 권한이 없습니다.");
        }

        walkMateCommentRepository.delete(findComment);
    }

    //----------------------------------------------//
    private Member methodFindByMemberId(long memberId){
        return memberRepository.findById(memberId).orElseThrow(
                () -> new RuntimeException("사용자를 찾을 수 없습니다.")
        );
    }

    private WalkMate methodFindByWalkId(long walkId){
        return walkMateRepository.findById(walkId).orElseThrow(
                () -> new RuntimeException("산책 게시글을 찾을 수 없습니다.")
        );
    }

    private MemberDto.Info getMemberInfoByComment(WalkMateComment comment) {
        Member member = methodFindByMemberId(comment.getMember().getMemberId());
        MemberDto.Info info = MemberDto.Info.builder()
                .memberId(member.getMemberId())
                .imageURL(member.getImageURL())
                .nickname(member.getNickname())
                .build();
        return info;
    }
}