package com.saecdo18.petmily.walkmate.post.controller;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.post.dto.WalkMateDto;
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
    private final MemberRepository memberRepository;
    private final WalkMateMapper mapper;

    public WalkMateController(WalkMateService walkMateService, WalkMateRepository walkMateRepository,
                              MemberRepository memberRepository, WalkMateMapper mapper) {
        this.walkMateService = walkMateService;
        this.walkMateRepository = walkMateRepository;
        this.memberRepository = memberRepository;
        this.mapper = mapper;
    }


    @PostMapping("/post/{member-id}")
    public ResponseEntity postWalk(@PathVariable("member-id") long memberId,
                                   @RequestBody WalkMateDto.Post walkPostDto){

        WalkMate mappingWalkMate = mapper.walkPostDtoToWalkMate(walkPostDto);
        WalkMate walkMate = walkMateService.createWalk(mappingWalkMate, memberId);
        WalkMateDto.Response responseDto = mapper.walkMateToWalkMateResponseDto(walkMate);

        return new ResponseEntity(responseDto, HttpStatus.CREATED);
    }

    @PatchMapping("/patch/{walk-id}/{member-id}")
    public ResponseEntity updateWalk(@PathVariable("walk-id") long walkId,
                                  @PathVariable("member-id") long memberId,
                                  @RequestBody WalkMateDto.Patch walkPatchDto){

        WalkMateDto.Response response = mapper.walkMateToWalkMateResponseDto(walkMateService.updateWalkMate(walkPatchDto, walkId, memberId));

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/get/{walk-id}")
    public ResponseEntity getWalk(@PathVariable("walk-id") long walkId){

        WalkMateDto.Response response = mapper.walkMateToWalkMateResponseDto(walkMateService.findWalk(walkId));
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/get/walks")
    public ResponseEntity getWalks(){

        List<WalkMate> walks = walkMateService.findWalks();
        List<WalkMateDto.Response> response =
                walks.stream()
                        .map(walk -> mapper.walkMateToWalkMateResponseDto(walk))
                        .collect(Collectors.toList());

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{walk-id}/{member-id}")
    public ResponseEntity deleteWalk(@PathVariable("walk-id") long walkId,
                                     @PathVariable("member-id") long memberId){

        walkMateService.deleteWalk(walkId, memberId);

        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
