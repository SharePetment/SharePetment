package com.saecdo18.petmily.walkmate.post.controller;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.walkmate.post.dto.WalkPatchDto;
import com.saecdo18.petmily.walkmate.post.dto.WalkPostDto;
import com.saecdo18.petmily.walkmate.post.dto.WalkResponseDto;
import com.saecdo18.petmily.walkmate.post.entity.WalkMate;
import com.saecdo18.petmily.walkmate.post.mapper.WalkMateMapper;
import com.saecdo18.petmily.walkmate.post.repository.WalkMateRepository;
import com.saecdo18.petmily.walkmate.post.service.WalkMateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/walkmate")
public class WalkMateController {

    private final WalkMateService walkMateService;
    private final WalkMateRepository walkMateRepository;
    private final WalkMateMapper mapper;

    public WalkMateController(WalkMateService walkMateService, WalkMateRepository walkMateRepository, WalkMateMapper mapper) {
        this.walkMateService = walkMateService;
        this.walkMateRepository = walkMateRepository;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity postWalk(@RequestBody WalkPostDto walkPostDto){

        WalkMate walk = WalkMate.builder()
                .title(walkPostDto.getTitle())
                .content(walkPostDto.getContent())
                .mapURL(walkPostDto.getMapURL())
                .chatURL(walkPostDto.getChatURL())
                .location(walkPostDto.getLocation())
                .time(walkPostDto.getTime())
                .open(walkPostDto.getOpen())
                .maximum(walkPostDto.getMaximum())
                .build();

        walkMateService.createWalk(walk);
        System.out.println("산책 등록 완료");
        WalkResponseDto response = mapper.walkToWalkResponseDto(walk);

        return new ResponseEntity(response, HttpStatus.CREATED);
    }

//    @PatchMapping("/get/{walk-id}/{member-id}")
//    public ResponseEntity getWalk(@PathVariable("walk-id") long walkId,
//                                  @PathVariable("member-id") long memberId,
//                                  @RequestBody WalkPatchDto walkPatchDto){
//
//        WalkMate findWalk = walkMateService.findWalk(walkId);
//
//    }

    @GetMapping("/get/{walk-id}")
    public ResponseEntity getWalk(@PathVariable("walk-id") long walkId){

        WalkMate walk = walkMateService.findWalk(walkId);
        WalkResponseDto response = mapper.walkToWalkResponseDto(walk);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/get/walks")
    public ResponseEntity getWalks(){

        List<WalkMate> walks = walkMateService.findWalks();

        List<WalkResponseDto> response =
                walks.stream()
                        .map(walk -> mapper.walkToWalkResponseDto(walk))
                        .collect(Collectors.toList());

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{walk-id}")
    public ResponseEntity deleteWalk(@PathVariable("walk-id") long walkId){

        // memberid를 통해 해당 게시글을 작성한 본인이 맞는지 확인

        walkMateService.deleteWalk(walkId);

        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
