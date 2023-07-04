package com.saecdo18.petmily.walkmate.post.controller;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.member.service.MemberService;
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
import java.util.Optional;
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
                                   @RequestBody WalkPostDto walkPostDto){

        Member member = memberRepository.findById(memberId).orElseThrow();

        WalkMate walk = WalkMate.builder()
                .member(member)
                .title(walkPostDto.getTitle())
                .content(walkPostDto.getContent())
                .mapURL(walkPostDto.getMapURL())
                .chatURL(walkPostDto.getChatURL())
                .location(walkPostDto.getLocation())
                .time(walkPostDto.getTime())
                .open(true)
                .maximum(walkPostDto.getMaximum())
                .likes(0)
                .build();

        walkMateService.createWalk(walk);
        WalkResponseDto response = mapper.walkToWalkResponseDto(walk);

        return new ResponseEntity(response, HttpStatus.CREATED);
    }

    @PatchMapping("/get/{walk-id}/{member-id}")
    public ResponseEntity getWalk(@PathVariable("walk-id") long walkId,
                                  @PathVariable("member-id") long memberId,
                                  @RequestBody WalkPatchDto walkPatchDto){

        WalkMate walk = walkMateService.findWalk(walkId);
        Member member = memberRepository.findById(memberId).orElseThrow();

        if (member != walk.getMember()){
//            권한없음 예외 던지기
        }

        walk.setTitle(walkPatchDto.getTitle());
        walk.setContent(walkPatchDto.getContent());
        walk.setMapURL(walkPatchDto.getMapURL());
        walk.setChatURL(walkPatchDto.getChatURL());
        walk.setLocation(walkPatchDto.getLocation());
        walk.setTime(walkPatchDto.getTime());
        walk.setOpen(walkPatchDto.getOpen());
        walk.setMaximum(walkPatchDto.getMaximum());

        WalkResponseDto response = mapper.walkToWalkResponseDto(walk);

        return new ResponseEntity(response, HttpStatus.OK);
    }

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

    @DeleteMapping("/delete/{walk-id}/{member-id}")
    public ResponseEntity deleteWalk(@PathVariable("walk-id") long walkId,
                                     @PathVariable("member-id") long memberId){

        WalkMate walk = walkMateService.findWalk(walkId);
        Member member = memberRepository.findById(memberId).orElseThrow();

        if(member!=walk.getMember()){
//            권한없음 예외 던지기
        }

        walkMateService.deleteWalk(walkId);

        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
