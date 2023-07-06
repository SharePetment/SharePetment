package com.saecdo18.petmily.walkmate.service;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
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

    public WalkMateCommentService(WalkMateCommentRepository walkMateCommentRepository, WalkMateRepository walkMateRepository, MemberRepository memberRepository) {
        this.walkMateCommentRepository = walkMateCommentRepository;
        this.walkMateRepository = walkMateRepository;
        this.memberRepository = memberRepository;
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
}
