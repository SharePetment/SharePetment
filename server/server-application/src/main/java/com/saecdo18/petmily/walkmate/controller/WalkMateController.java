package com.saecdo18.petmily.walkmate.controller;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.mapper.WalkMateMapper;
import com.saecdo18.petmily.walkmate.repository.WalkMateRepository;
import com.saecdo18.petmily.walkmate.service.WalkMateService;
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


    @PostMapping("/{member-id}")
    public ResponseEntity postWalk(@PathVariable("member-id") long memberId,
                                   @RequestBody WalkMateDto.Post walkPostDto){

        WalkMate mappingWalkMate = mapper.walkPostDtoToWalkMate(walkPostDto);
        WalkMate walkMate = walkMateService.createWalk(mappingWalkMate, memberId);
        WalkMateDto.Response responseDto = mapper.walkMateToWalkMateResponseDto(walkMate);

        return new ResponseEntity(responseDto, HttpStatus.CREATED);
    }

    @PatchMapping("/{walk-id}/{member-id}")
    public ResponseEntity updateWalk(@PathVariable("walk-id") long walkId,
                                  @PathVariable("member-id") long memberId,
                                  @RequestBody WalkMateDto.Patch walkPatchDto){

        WalkMateDto.Response response = mapper.walkMateToWalkMateResponseDto(walkMateService.updateWalkMate(walkPatchDto, walkId, memberId));

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/{walk-id}")
    public ResponseEntity getWalk(@PathVariable("walk-id") long walkId){

        WalkMateDto.Response response = walkMateService.findWalk(walkId);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/walks")
    public ResponseEntity getWalks(@RequestParam("location") String location,
                                   @RequestParam("page") int page,
                                   @RequestParam("size") int size){

        List<WalkMate> response = walkMateService.recentPage(page, size, location);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @DeleteMapping("/{walk-id}/{member-id}")
    public ResponseEntity deleteWalk(@PathVariable("walk-id") long walkId,
                                     @PathVariable("member-id") long memberId){

        walkMateService.deleteWalk(walkId, memberId);

        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/like/{walk-id}/{member-id}")
    public ResponseEntity likeWalk(@PathVariable("walk-id") long walkId,
                                   @PathVariable("member-id") long memberId){

        WalkMateDto.Like response = walkMateService.likeByMember(walkId, memberId);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PatchMapping("/openstatus/{status}/{walk-id}/{member-id}")
    public ResponseEntity changeOpenStatus(@PathVariable("status") boolean status,
                                            @PathVariable("walk-id") long walkId,
                                           @PathVariable("member-id") long memberId){

        WalkMateDto.Open response = walkMateService.changeOpenStatus(status, walkId, memberId);
        return new ResponseEntity(response, HttpStatus.OK);
    }
}
