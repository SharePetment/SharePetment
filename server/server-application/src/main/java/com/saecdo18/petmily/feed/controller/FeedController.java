package com.saecdo18.petmily.feed.controller;

import com.saecdo18.petmily.feed.dto.FeedDto;
import com.saecdo18.petmily.feed.service.FeedServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/feeds")
@RequiredArgsConstructor
public class FeedController {

    private final FeedServiceImpl feedService;

    @GetMapping("/{feed-id}/{member-id}")
    public ResponseEntity<?> getFeed(@PathVariable("feed-id") long feedId,
                                     @PathVariable("member-id") long memberId) {
        FeedDto.Response response = feedService.getFeed(feedId, memberId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/list/random")
    public ResponseEntity<?> getFeedsRandom(@RequestBody FeedDto.PreviousListIds listIds) {
        List<FeedDto.Response> responseList = feedService.getFeedsRandom(listIds);
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/myfeeds/{member-id}")
    public ResponseEntity<?> getFeedsByMember(@PathVariable("member-id") long memberId) {
        return null;
    }

    @GetMapping("/list/{member-id}")
    public ResponseEntity<?> getFeedsByMemberFollow(@PathVariable("member-id") long memberId) {
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
        FeedDto.Response response = feedService.createFeed(post);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping("/{feed-id}/{member-id}")
    public ResponseEntity<?> patchFeed(@PathVariable("feed-id") long feedId,
                                       @PathVariable("member-id") long memberId,
                                       @RequestParam("content") String content,
                                       @RequestParam("addImage") MultipartFile[] addImages,
                                       @RequestParam("deleteImage") String[] deleteImages) throws IOException {

        FeedDto.Patch patch = FeedDto.Patch.builder()
                .feedId(feedId)
                .memberId(memberId)
                .content(content)
                .addImages(List.of(addImages))
                .deleteImages(List.of(deleteImages))
                .build();
        FeedDto.Response response = feedService.patchFeed(patch);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{feed-id}/{member-id}")
    public ResponseEntity<?> deleteFeed(@PathVariable("feed-id") long feedId, @PathVariable("member-id") long memberId) {
        feedService.deleteFeed(feedId, memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/like/{feed-id}/{member-id}")
    public ResponseEntity<?> likeFeed(@PathVariable("feed-id") long feedId, @PathVariable("member-id") long memberId) {
        FeedDto.Like response = feedService.likeByMember(feedId, memberId);
        return ResponseEntity.ok(response);
    }
}
