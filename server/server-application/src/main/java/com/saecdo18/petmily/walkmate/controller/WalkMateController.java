package com.saecdo18.petmily.walkmate.controller;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.mapper.WalkMateMapper;
import com.saecdo18.petmily.walkmate.repository.WalkMateRepository;
import com.saecdo18.petmily.walkmate.service.WalkMateService;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/walkmates")
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
        WalkMateDto.Response response = walkMateService.createWalk(mappingWalkMate, memberId);

        return new ResponseEntity(response, HttpStatus.CREATED);
    }

    @PatchMapping("/{walk-id}/{member-id}")
    @ApiOperation(value = "산책게시물 수정")
    public ResponseEntity updateWalk(@PathVariable("walk-id") long walkId,
                                  @PathVariable("member-id") long memberId,
                                  @RequestBody WalkMateDto.Patch walkPatchDto){

        WalkMateDto.Response response = walkMateService.updateWalkMate(walkPatchDto, walkId, memberId);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/bywalk/{walk-id}")
    public ResponseEntity getWalkByWalkId(@PathVariable("walk-id") long walkId){

        WalkMateDto.Response response = walkMateService.findWalkByWalkId(walkId);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/bymember/{member-id}")
    public ResponseEntity getWalksByMemberId(@RequestParam("openFilter") boolean open,
                                            @RequestParam("page") int page,
                                            @RequestParam("size") int size,
                                            @PathVariable("member-id") long memberId){

        List<WalkMateDto.Response> response = walkMateService.findWalksByMemberId(page, size, memberId, open);
        return new ResponseEntity(response, HttpStatus.OK);
    }


    @GetMapping("/walks")
    public ResponseEntity getWalks(@RequestParam("openFilter") boolean open,
                                   @RequestParam("location") String location,
                                   @RequestParam("page") int page,
                                   @RequestParam("size") int size){

        List<WalkMate> response = walkMateService.recentPage(page, size, location, open);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/have/comments/{member-id}")
    public ResponseEntity getCommentedWalk(@PathVariable("member-id") long memberId){

        List<WalkMateDto.Response> response = walkMateService.findCommentedWalks(memberId);

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
