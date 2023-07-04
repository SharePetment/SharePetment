package com.saecdo18.petmily.feed.controller;

import com.saecdo18.petmily.feed.dto.FeedCommentDto;
import com.saecdo18.petmily.feed.service.FeedCommentServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/feeds/comments")
@RequiredArgsConstructor
public class FeedCommentController {
    private final FeedCommentServiceImpl feedCommentService;

    @PostMapping
    public ResponseEntity<?> createComment(@Valid @RequestBody FeedCommentDto.Post post) {
        FeedCommentDto.Response response = feedCommentService.createComment(post);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping("/{comment-id}/{member-id}")
    public ResponseEntity<?> patchComment(@PathVariable("comment-id") long commentId,
                                          @PathVariable("member-id") long memberId,
                                          @Valid @RequestBody FeedCommentDto.Patch patch) {
        FeedCommentDto.Response response = feedCommentService.updateComment(patch, commentId, memberId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{comment-id}/{member-id}")
    public ResponseEntity<?> deleteComment(@PathVariable("comment-id") long commentId,
                                           @PathVariable("member-id") long memberId) {
        feedCommentService.deleteComment(commentId, memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

//    @PatchMapping("/like/{comment-id}/{member-id}")
//    public ResponseEntity<?> likeComment(@PathVariable("comment-id") long commentId,
//                                         @PathVariable("member-id") long memberId) {
//
//    }
}
