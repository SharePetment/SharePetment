package com.saecdo18.petmily.walkmate.comment.controller;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.comment.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.comment.dto.WalkMateCommentResponseDto;
import com.saecdo18.petmily.walkmate.comment.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.comment.mapper.WalkMateCommentMapper;
import com.saecdo18.petmily.walkmate.comment.repository.WalkMateCommentRepository;
import com.saecdo18.petmily.walkmate.comment.service.WalkMateCommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/walkmate/comment")
public class WalkMateCommentController {

    private final WalkMateCommentService walkMateCommentService;
    private final WalkMateCommentRepository walkMateCommentRepository;
    private final MemberRepository memberRepository;
    private final WalkMateCommentMapper mapper;

    public WalkMateCommentController(WalkMateCommentService walkMateCommentService, WalkMateCommentRepository walkMateCommentRepository,
                                     WalkMateCommentMapper mapper, MemberRepository memberRepository) {
        this.walkMateCommentService = walkMateCommentService;
        this.walkMateCommentRepository = walkMateCommentRepository;
        this.mapper=mapper;
        this.memberRepository = memberRepository;
    }

    @PostMapping("/post/{walk-id}/{member-id}")
    public ResponseEntity postComment(@PathVariable("walk-id") long walkId,
                                      @PathVariable("member-id") long memberId,
                                      @RequestBody WalkMateCommentDto walkMateCommentDto){

        Member member = memberRepository.findById(memberId).orElseThrow();

        WalkMateComment comment = WalkMateComment.builder()
                .content(walkMateCommentDto.getComment())
                .likes(0)
                .walkMatePostId(walkId)
                .member(member)
                .build();

        walkMateCommentService.createComments(comment);
        WalkMateCommentResponseDto response = mapper.commentToCommentResponseDto(comment);

        return new ResponseEntity(response, HttpStatus.CREATED);
    }

}
