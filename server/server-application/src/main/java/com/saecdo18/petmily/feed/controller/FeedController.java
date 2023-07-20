package com.saecdo18.petmily.feed.controller;

import com.saecdo18.petmily.feed.dto.FeedDto;
import com.saecdo18.petmily.feed.dto.FeedDtoList;
import com.saecdo18.petmily.feed.dto.FeedServiceDto;
import com.saecdo18.petmily.feed.mapper.FeedMapper;
import com.saecdo18.petmily.feed.service.FeedServiceImpl;
import com.saecdo18.petmily.util.AuthenticationGetMemberId;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/feeds")
@RequiredArgsConstructor
@Api(value = "Feed API 컨트롤러", tags = "Feed API")
public class FeedController {

    private final FeedServiceImpl feedService;
    private final AuthenticationGetMemberId authenticationGetMemberId;
    private final FeedMapper feedMapper;

    @ApiOperation("피드 가져오기")
    @GetMapping("/{feed-id}")
    public ResponseEntity<FeedDto.Response> getFeed(@ApiParam("피드 아이디") @PathVariable("feed-id") long feedId) {
        long memberId = authenticationGetMemberId.getMemberId();
        FeedDto.Response response = feedService.getFeed(feedId, memberId);

        return ResponseEntity.ok(response);
    }

    @ApiOperation("최신 피드 리스트 가져오기")
    @PostMapping("/list/random")
    public ResponseEntity<FeedDtoList> getFeedsRandom(@ApiParam("페이지 번호") @RequestParam(defaultValue = "0") int page,
                                                      @ApiParam("페이지당 받을 피드 수") @RequestParam(defaultValue = "10") int size) {
        log.info("getFeedsRandom start");
        long memberId = authenticationGetMemberId.getMemberId();
        FeedDtoList responseList = feedService.getFeedsRecent(memberId, page, size);
        log.info("getFeedsRandom end");
        return ResponseEntity.ok(responseList);
    }

    @ApiOperation("사용자 피드 리스트 가져오기")
    @GetMapping("/my-feed")
    public ResponseEntity<FeedDtoList> getFeedsByMember(@ApiParam("페이지 번호") @RequestParam(defaultValue = "0") int page,
                                                        @ApiParam("페이지당 받을 피드 수") @RequestParam(defaultValue = "10") int size) {
        long memberId = authenticationGetMemberId.getMemberId();
        FeedDtoList responseList = feedService.getFeedsByMember(page, size, memberId);
        return ResponseEntity.ok(responseList);
    }

    @ApiOperation("타인 피드 리스트 가져오기(타인 마이 페이지 접속시 해당 회원의 피드리스트 보기 위함)")
    @GetMapping("/other-feed/{member-id}")
    public ResponseEntity<FeedDtoList> getFeedsByMember(@ApiParam("다른 회원 id") @PathVariable("member-id") long memberId,
                                                        @ApiParam("페이지 번호") @RequestParam(defaultValue = "0") int page,
                                                        @ApiParam("페이지당 받을 피드 수") @RequestParam(defaultValue = "10") int size) {

        FeedDtoList responseList = feedService.getFeedsByMember(page, size, memberId);
        return ResponseEntity.ok(responseList);
    }

    @ApiOperation("팔로우한 사용자 피드 리스트 가져오기")
    @PostMapping("/list")
    public ResponseEntity<FeedDtoList> getFeedsByMemberFollow(@ApiParam("페이지 번호") @RequestParam(defaultValue = "0") int page,
                                                              @ApiParam("페이지당 받을 피드 수") @RequestParam(defaultValue = "10") int size) {
        log.info("getFeedsByMemberFollow start");
        log.info("size = {}", size);
        long memberId = authenticationGetMemberId.getMemberId();
        FeedDtoList responseList = feedService.getFeedsByMemberFollow(memberId, page, size);
        if (responseList.getResponseList().size() < size) {
            FeedDtoList addResponseList = feedService.getFeedsRecent(memberId, page, size);
            log.info("getFeedRecent size = {}" , addResponseList.getResponseList().size());
            responseList.getResponseList().addAll(addResponseList.getResponseList());
        }
        log.info("init responseList size = {}", responseList.getResponseList().size());
        List<FeedDto.Response> responses = responseList.getResponseList().subList(0, size);

        responseList.setResponseList(responses);
        log.info("getFeedsByMemberFollow end");
        return ResponseEntity.ok(responseList);
    }


    @ApiOperation("피드 생성")
    @PostMapping
    public ResponseEntity<FeedDto.Response> createFeed(@ApiParam("피드 내용") @RequestParam("content") String content,
                                                       @ApiParam(value = "업로드 이미지 리스트") @RequestParam(value = "images", required = false) MultipartFile[] images) throws IOException {
        long memberId = authenticationGetMemberId.getMemberId();

        List<MultipartFile> imageList = new ArrayList<>();
        FeedServiceDto.Post post = FeedServiceDto.Post.builder()
                .content(content)
                .images(images == null ? imageList : List.of(images))
                .build();
        FeedDto.Response response = feedService.createFeed(post, memberId);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @ApiOperation("피드 수정")
    @PatchMapping("/{feed-id}")
    public ResponseEntity<FeedDto.Response> patchFeed(@ApiParam("피드 아이디") @PathVariable("feed-id") long feedId,
                                                      @ApiParam("피드 수정 내용") @RequestParam("content") String content,
                                                      @ApiParam(value = "피드 추가 이미지 리스트") @RequestParam(value = "addImage", required = false) MultipartFile[] addImages,
                                                      @ApiParam("삭제 이미지 원본 파일 이름 리스트") @RequestParam(value = "deleteImage", required = false) String[] deleteImages) throws IOException {

        long memberId = authenticationGetMemberId.getMemberId();
        List<MultipartFile> addImageList = new ArrayList<>();
        List<String> deleteImagesList = new ArrayList<>();
        FeedServiceDto.Patch patch = FeedServiceDto.Patch.builder()
                .feedId(feedId)
                .content(content)
                .addImages(addImages == null ? addImageList : List.of(addImages))
                .deleteImages(deleteImages == null ? deleteImagesList : List.of(deleteImages))
                .build();
        FeedDto.Response response = feedService.patchFeed(patch, memberId);
        return ResponseEntity.ok(response);
    }

    @ApiOperation("피드 삭제")
    @DeleteMapping("/{feed-id}")
    public ResponseEntity<?> deleteFeed(@ApiParam("피드 아이디") @PathVariable("feed-id") long feedId) {
        long memberId = authenticationGetMemberId.getMemberId();
        feedService.deleteFeed(feedId, memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @ApiOperation("피드 좋아요 누르기")
    @PatchMapping("/like/{feed-id}")
    public ResponseEntity<FeedDto.Like> likeFeed(@ApiParam("피드 아이디") @PathVariable("feed-id") long feedId) {
        long memberId = authenticationGetMemberId.getMemberId();
        FeedDto.Like response = feedService.likeByMember(feedId, memberId);
        return ResponseEntity.ok(response);
    }

    @ApiOperation("redis 값 삭제")
    @DeleteMapping("/redis")
    public ResponseEntity<?> deleteRedis() {
        long memberId = authenticationGetMemberId.getMemberId();
        feedService.deleteRedis(memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
