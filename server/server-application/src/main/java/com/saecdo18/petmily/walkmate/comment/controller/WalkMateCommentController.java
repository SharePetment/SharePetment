package com.saecdo18.petmily.walkmate.comment.controller;

import com.saecdo18.petmily.walkmate.comment.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.comment.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.comment.mapper.WalkMateCommentMapper;
import com.saecdo18.petmily.walkmate.comment.repository.WalkMateCommentRepository;
import com.saecdo18.petmily.walkmate.comment.service.WalkMateCommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/walkmate/comment")
public class WalkMateCommentController {

    private final WalkMateCommentService walkMateCommentService;
    private final WalkMateCommentMapper mapper;

    public WalkMateCommentController(WalkMateCommentService walkMateCommentService, WalkMateCommentMapper mapper) {
        this.walkMateCommentService = walkMateCommentService;
        this.mapper = mapper;
    }

    @PostMapping("/post/{walk-id}/{member-id}")
    private ResponseEntity postComment(@PathVariable("walk-id") long walkId,
                                       @PathVariable("member-id") long memberId,
                                       @RequestBody WalkMateCommentDto.Post commentPostDto){

        WalkMateComment mappingComment = mapper.commentPostDtoToComment(commentPostDto);
        WalkMateComment comment = walkMateCommentService.createComments(mappingComment, walkId, memberId);
        WalkMateCommentDto.Response response = mapper.commentToCommentResponseDto(comment);

        return new ResponseEntity(response, HttpStatus.CREATED);
    }

    @GetMapping("/get/bywalk/{walk-id}")
    private ResponseEntity getCommentsByWalk(@PathVariable("walk-id") long walkId){

        List<WalkMateComment> comments = walkMateCommentService.findCommentsByWalkId(walkId);
        List<WalkMateCommentDto.Response> response =
                comments.stream()
                        .map(comment -> mapper.commentToCommentResponseDto(comment))
                        .collect(Collectors.toList());

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/get/bymember/{member-id}")
    private ResponseEntity getCommentsByMember(@PathVariable("member-id") long memberId) {

        List<WalkMateComment> comments = walkMateCommentService.findCommentsByMemberId(memberId);
        List<WalkMateCommentDto.Response> response =
                comments.stream()
                        .map(comment -> mapper.commentToCommentResponseDto(comment))
                        .collect(Collectors.toList());

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/get/allcomments")
    private ResponseEntity getAllComments(){

        List<WalkMateComment> comments = walkMateCommentService.findAllComments();
        List<WalkMateCommentDto.Response> response =
                comments.stream()
                        .map(comment -> mapper.commentToCommentResponseDto(comment))
                        .collect(Collectors.toList());

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PatchMapping("/patch/{comment-id}/{member-id}")
    private ResponseEntity patchComment(@PathVariable("comment-id") long commentId,
                                        @PathVariable("member-id") long memberId,
                                        @RequestBody WalkMateCommentDto.Patch commentPatchDto) {

        WalkMateComment findComment = mapper.commentPatchDtoToComment(commentPatchDto);
        WalkMateComment responseComment = walkMateCommentService.updateComment(findComment, commentId, memberId);
        WalkMateCommentDto.Response response = mapper.commentToCommentResponseDto(responseComment);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{comment-id}/{member-id}")
    private ResponseEntity deleteComment(@PathVariable("comment-id") long commentId,
                                         @PathVariable("member-id") long memberId){

        walkMateCommentService.deleteComment(commentId, memberId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

}
