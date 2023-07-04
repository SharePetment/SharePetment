package com.saecdo18.petmily.walkmate.comment.service;

import com.saecdo18.petmily.walkmate.comment.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.comment.repository.WalkMateCommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WalkMateCommentService {

    private final WalkMateCommentRepository walkMateCommentRepository;

    public WalkMateCommentService(WalkMateCommentRepository walkMateCommentRepository) {
        this.walkMateCommentRepository = walkMateCommentRepository;
    }

    public WalkMateComment createComments(WalkMateComment comment){

        return walkMateCommentRepository.save(comment);
    }

    public WalkMateComment findComments(long commentId){

        Optional<WalkMateComment> optionalWalkMateComment = walkMateCommentRepository.findById(commentId);
        WalkMateComment findComment = optionalWalkMateComment.orElseThrow();

        return findComment;
    }

    public List<WalkMateComment> findComments(){

        return walkMateCommentRepository.findAll();
    }

    public void deleteComment(long commentId){

        Optional<WalkMateComment> optionalWalkMateComment = walkMateCommentRepository.findById(commentId);
        WalkMateComment findWalk = optionalWalkMateComment.orElseThrow();

        walkMateCommentRepository.delete(findWalk);
    }
}
