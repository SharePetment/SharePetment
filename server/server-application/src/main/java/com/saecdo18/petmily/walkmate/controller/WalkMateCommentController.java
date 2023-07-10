package com.saecdo18.petmily.walkmate.controller;

import com.saecdo18.petmily.walkmate.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.mapper.WalkMateCommentMapper;
import com.saecdo18.petmily.walkmate.service.WalkMateCommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/walkmates/comments")
public class WalkMateCommentController {

    private final WalkMateCommentService walkMateCommentService;
    private final WalkMateCommentMapper mapper;

    public WalkMateCommentController(WalkMateCommentService walkMateCommentService, WalkMateCommentMapper mapper) {
        this.walkMateCommentService = walkMateCommentService;
        this.mapper = mapper;
    }

    @PostMapping("/{walk-id}/{member-id}")
    private ResponseEntity<WalkMateCommentDto.Response> postComment(@PathVariable("walk-id") long walkId,
                                       @PathVariable("member-id") long memberId,
                                       @RequestBody WalkMateCommentDto.Post commentPostDto){

        WalkMateCommentDto.Response response = walkMateCommentService.createComments(commentPostDto, walkId, memberId);

        return new ResponseEntity(response, HttpStatus.CREATED);
    }

    @GetMapping("/bywalk/{walk-id}")
    private ResponseEntity getCommentsByWalk(@PathVariable("walk-id") long walkId){

        List<WalkMateComment> comments = walkMateCommentService.findCommentsByWalkId(walkId);
        List<WalkMateCommentDto.Response> response =
                comments.stream()
                        .map(comment -> walkMateCommentService.findComment(comment.getWalkMateCommentId()))
                        .collect(Collectors.toList());

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/bymember/{member-id}")
    private ResponseEntity getCommentsByMember(@PathVariable("member-id") long memberId) {

        List<WalkMateComment> comments = walkMateCommentService.findCommentsByMemberId(memberId);
        List<WalkMateCommentDto.Response> response =
                comments.stream()
                        .map(comment -> walkMateCommentService.findComment(comment.getWalkMateCommentId()))
                        .collect(Collectors.toList());

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/allcomments")
    private ResponseEntity getAllComments(){

        List<WalkMateComment> comments = walkMateCommentService.findAllComments();
        List<WalkMateCommentDto.Response> response =
                comments.stream()
                        .map(comment -> walkMateCommentService.findComment(comment.getWalkMateCommentId()))
                        .collect(Collectors.toList());

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PatchMapping("/{comment-id}/{member-id}")
    private ResponseEntity patchComment(@PathVariable("comment-id") long commentId,
                                        @PathVariable("member-id") long memberId,
                                        @RequestBody WalkMateCommentDto.Patch commentPatchDto) {

        WalkMateCommentDto.Response response = walkMateCommentService.updateComment(commentPatchDto, commentId, memberId);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @DeleteMapping("/{comment-id}/{member-id}")
    private ResponseEntity deleteComment(@PathVariable("comment-id") long commentId,
                                         @PathVariable("member-id") long memberId){

        walkMateCommentService.deleteComment(commentId, memberId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

}
