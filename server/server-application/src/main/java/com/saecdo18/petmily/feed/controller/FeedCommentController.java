package com.saecdo18.petmily.feed.controller;

import com.saecdo18.petmily.feed.dto.FeedCommentDto;
import com.saecdo18.petmily.feed.service.FeedCommentServiceImpl;
import com.saecdo18.petmily.util.AuthenticationGetMemberId;
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
    private final AuthenticationGetMemberId authenticationGetMemberId;

    @PostMapping
    public ResponseEntity<FeedCommentDto.Response> createComment(@Valid @RequestBody FeedCommentDto.Post post) {
        long memberId = authenticationGetMemberId.getMemberId();
        FeedCommentDto.Response response = feedCommentService.createComment(post, memberId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping("/{comment-id}")
    public ResponseEntity<FeedCommentDto.Response> patchComment(@PathVariable("comment-id") long commentId,
                                          @Valid @RequestBody FeedCommentDto.Patch patch) {
        long memberId = authenticationGetMemberId.getMemberId();
        FeedCommentDto.Response response = feedCommentService.updateComment(patch, commentId, memberId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{comment-id}")
    public ResponseEntity<?> deleteComment(@PathVariable("comment-id") long commentId) {
        long memberId = authenticationGetMemberId.getMemberId();
        feedCommentService.deleteComment(commentId, memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
