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

    public WalkMateComment createComments(WalkMateComment comment, long walkId, long memberId){

        WalkMate walk = walkMateRepository.findById(walkId).orElseThrow();
        Member member = memberRepository.findById(memberId).orElseThrow();

        WalkMateComment saveComment = WalkMateComment.builder()
                .walkMate(walk)
                .member(member)
                .content(comment.getContent())
                .likes(0)
                .build();

        return walkMateCommentRepository.save(saveComment);
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

    public List<WalkMateComment> findAllComments(){

        return walkMateCommentRepository.findAll();
    }

    public List<WalkMateComment> findCommentsByWalkId(long walkId){

        List<WalkMateComment> allComments = walkMateCommentRepository.findAll();
        List<WalkMateComment> findComments = allComments.stream()
                .filter(comment -> comment.getWalkMate().getWalkMatePostId()==walkId)
                .collect(Collectors.toList());

        return findComments;
    }

    public List<WalkMateComment> findCommentsByMemberId(long memberId){

        List<WalkMateComment> allComments = walkMateCommentRepository.findAll();
        List<WalkMateComment> findComments = allComments.stream()
                .filter(comment -> comment.getMember().getMemberId()==memberId)
                .collect(Collectors.toList());

        return findComments;
    }

    public WalkMateComment updateComment(WalkMateComment comment, long commentId, long memberId){

        WalkMateComment findComment = walkMateCommentRepository.findById(commentId).orElseThrow();

        if(memberId!=findComment.getMember().getMemberId()){
            throw new IllegalArgumentException("수정할 권한이 없습니다.");
        }

        findComment.setContent(comment.getContent());

        return walkMateCommentRepository.save(findComment);
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
}