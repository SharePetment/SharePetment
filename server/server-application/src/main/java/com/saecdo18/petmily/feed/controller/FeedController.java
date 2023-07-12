package com.saecdo18.petmily.feed.controller;

import com.saecdo18.petmily.feed.dto.FeedDto;
import com.saecdo18.petmily.feed.service.FeedServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/feeds")
@RequiredArgsConstructor
@Api(value = "Feed API 컨트롤러", tags = "Feed API")
public class FeedController {

    private final FeedServiceImpl feedService;

    @ApiOperation("피드 가져오기")
    @GetMapping("/all/{feed-id}/{member-id}")
    public ResponseEntity<FeedDto.Response> getFeed(@ApiParam("피드 아이디") @PathVariable("feed-id") long feedId,
                                     @ApiParam("사용자 아이디") @PathVariable("member-id") long memberId) {
        FeedDto.Response response = feedService.getFeed(feedId, memberId);
        return ResponseEntity.ok(response);
    }

    @ApiOperation("최신 피드 리스트 가져오기")
    @GetMapping("/all/list/random/{member-id}")
    public ResponseEntity<List<FeedDto.Response>> getFeedsRandom(@ApiParam("전에 받은 피드 아이디 리스트") @RequestBody FeedDto.PreviousListIds listIds,
                                            @ApiParam("사용자 아이디") @PathVariable("member-id") long memberId) {
        List<FeedDto.Response> responseList = feedService.getFeedsRecent(listIds, memberId);
        return ResponseEntity.ok(responseList);
    }

    @ApiOperation("사용자 피드 리스트 가져오기")
    @GetMapping("/my-feed/{member-id}")
    public ResponseEntity<List<FeedDto.Response>> getFeedsByMember(@ApiParam("사용자 아이디") @PathVariable("member-id") Long memberId,
                                              @ApiParam("페이지 번호") @RequestParam(defaultValue = "0") int page,
                                              @ApiParam("페이지당 받을 피드 수") @RequestParam(defaultValue = "10") int size) {
        List<FeedDto.Response> responseList = feedService.getFeedsByMember(page, size, memberId);
        return ResponseEntity.ok(responseList);
    }

    @ApiOperation("팔로우한 사용자 피드 리스트 가져오기")
    @GetMapping("/list/{member-id}")
    public ResponseEntity<List<FeedDto.Response>> getFeedsByMemberFollow(@ApiParam("전에 받은 피드 아이디 리스트") @RequestBody FeedDto.PreviousListIds listIds,
                                                    @ApiParam("사용자 아이디") @PathVariable("member-id") long memberId) {
        List<FeedDto.Response> responseList = feedService.getFeedsByMemberFollow(memberId, listIds);
        return ResponseEntity.ok(responseList);
    }


    @ApiOperation("피드 생성")
    @PostMapping
    public ResponseEntity<FeedDto.Response> createFeed(@ApiParam("사용자 아이디") @RequestParam("memberId") String memberId,
                                        @ApiParam("피드 내용") @RequestParam("content") String content,
                                        @ApiParam(value = "업로드 이미지 리스트") @RequestParam(value = "images", required = false)MultipartFile[] images) throws IOException {
        long longMemberId = Long.parseLong(memberId);

        List<MultipartFile> imageList = new ArrayList<>();
        FeedDto.Post post = FeedDto.Post.builder()
                .memberId(longMemberId)
                .content(content)
                .images(images == null ? imageList : List.of(images))
                .build();
        FeedDto.Response response = feedService.createFeed(post);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @ApiOperation("피드 수정")
    @PatchMapping("/{feed-id}/{member-id}")
    public ResponseEntity<FeedDto.Response> patchFeed(@ApiParam("피드 아이디") @PathVariable("feed-id") long feedId,
                                       @ApiParam("사용자 아이디") @PathVariable("member-id") long memberId,
                                       @ApiParam("피드 수정 내용") @RequestParam("content") String content,
                                       @ApiParam(value = "피드 추가 이미지 리스트") @RequestParam(value = "addImage", required = false)  MultipartFile[] addImages,
                                       @ApiParam("삭제 이미지 원본 파일 이름 리스트") @RequestParam(value = "deleteImage", required = false) String[] deleteImages) throws IOException {


        List<MultipartFile> addImageList = new ArrayList<>();
        List<String> deleteImagesList = new ArrayList<>();
        FeedDto.Patch patch = FeedDto.Patch.builder()
                .feedId(feedId)
                .memberId(memberId)
                .content(content)
                .addImages(addImages == null ? addImageList: List.of(addImages))
                .deleteImages(deleteImages == null ? deleteImagesList : List.of(deleteImages) )
                .build();
        FeedDto.Response response = feedService.patchFeed(patch);
        return ResponseEntity.ok(response);
    }

    @ApiOperation("피드 삭제")
    @DeleteMapping("/{feed-id}/{member-id}")
    public ResponseEntity<?> deleteFeed(@ApiParam("피드 아이디") @PathVariable("feed-id") long feedId,
                                        @ApiParam("사용자 아이디") @PathVariable("member-id") long memberId) {
        feedService.deleteFeed(feedId, memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @ApiOperation("피드 좋아요 누르기")
    @PatchMapping("/like/{feed-id}/{member-id}")
    public ResponseEntity<FeedDto.Like> likeFeed(@ApiParam("피드 아이디") @PathVariable("feed-id") long feedId,
                                      @ApiParam("사용자 아이디") @PathVariable("member-id") long memberId) {
        FeedDto.Like response = feedService.likeByMember(feedId, memberId);
        return ResponseEntity.ok(response);
    }
}
