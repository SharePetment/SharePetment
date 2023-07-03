package com.saecdo18.petmily.feeds.controller;

import com.saecdo18.petmily.feeds.dto.FeedDto;
import com.saecdo18.petmily.feeds.service.FeedServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/feeds")
@RequiredArgsConstructor
public class FeedController {

    private final FeedServiceImpl feedService;

    @GetMapping("/{feed-id}")
    public ResponseEntity<?> getFeed(@PathVariable("feed-id") long feedId) {

        return ResponseEntity.ok(null);
    }

    @GetMapping("/noregister")
    public ResponseEntity<?> getFeedsByNoRegister() {
        return null;
    }

    @GetMapping("/myfeeds/{member-id}")
    public ResponseEntity<?> getFeedsByMember(@PathVariable("member-id") long memberId) {
        return null;
    }

    @GetMapping("/list/{member-id}")
    public ResponseEntity<?> getFeedsByMemberFollow(@PathVariable("member-id") long memberId) {
        return null;
    }

    @GetMapping("/list/random")
    public ResponseEntity<?> getFeedsByRandom() {
        return null;
    }

    @PostMapping
    public ResponseEntity<?> createFeed(@RequestParam("memberId") long memberID,
                                        @RequestParam("content") String content,
                                        @RequestParam("images")MultipartFile[] images) throws IOException {
        FeedDto.Post post = FeedDto.Post.builder()
                .memberId(memberID)
                .content(content)
                .images(List.of(images))
                .build();
        URI uri = feedService.createFeed(post);
        return ResponseEntity.ok(uri);
    }

    @PatchMapping("/{feed-id}/{member-id}")
    public ResponseEntity<?> patchFeed(@PathVariable("feed-id") long feedId, @PathVariable("member-id") long memberId) {
        return null;
    }

    @DeleteMapping("/{feed-id}/{member-id}")
    public ResponseEntity<?> deleteFeed(@PathVariable("feed-id") long feedId, @PathVariable("member-id") long memberId) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/like/{feed-id}/{member-id}")
    public ResponseEntity<?> likeFeed(@PathVariable("feed-id") long feedId, @PathVariable("member-id") long memberId) {
        return null;
    }
}
