package com.saecdo18.petmily.walkmate.controller;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.mapper.WalkMateMapper;
import com.saecdo18.petmily.walkmate.repository.WalkMateRepository;
import com.saecdo18.petmily.walkmate.service.WalkMateService;
import io.swagger.annotations.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/walkmates")
@Api(value = "WalkMate 컨트롤러 API", tags = "WalkMate API")
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
    @ApiOperation("산책 게시글 등록")
    public ResponseEntity<WalkMateDto.Response> postWalk(
            @ApiParam("회원 ID") @PathVariable("member-id") long memberId,
            @ApiParam("게시글 등록 Dto") @RequestBody WalkMateDto.Post walkPostDto){

        WalkMate mappingWalkMate = mapper.walkPostDtoToWalkMate(walkPostDto);
        WalkMateDto.Response response = walkMateService.createWalk(mappingWalkMate, memberId);

        return new ResponseEntity(response, HttpStatus.CREATED);
    }

    @PatchMapping("/{walk-id}/{member-id}")
    @ApiOperation("산책 게시글 수정")
    public ResponseEntity<WalkMateDto.Response> updateWalk(@ApiParam("게시글 ID") @PathVariable("walk-id") long walkId,
                                                           @ApiParam("회원 ID") @PathVariable("member-id") long memberId,
                                                           @ApiParam("게시글 수정 Dto") @RequestBody WalkMateDto.Patch walkPatchDto){

        WalkMateDto.Response response = walkMateService.updateWalkMate(walkPatchDto, walkId, memberId);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/bywalk/{walk-id}")
    @ApiOperation("산책 게시글 조회(게시글 ID)")
    public ResponseEntity<WalkMateDto.Response> getWalkByWalkId(@ApiParam("게시글 ID") @PathVariable("walk-id") long walkId){

        WalkMateDto.Response response = walkMateService.findWalkByWalkId(walkId);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/bymember/{member-id}")
    @ApiOperation("산책 게시글 조회(회원 ID)")
    public ResponseEntity<List<WalkMateDto.Response>> getWalksByMemberId(@ApiParam("모집 여부") @RequestParam("openFilter") boolean open,
                                                                         @ApiParam("page") @RequestParam("page") int page,
                                                                         @ApiParam("size") @RequestParam("size") int size,
                                                                         @ApiParam("회원 ID") @PathVariable("member-id") long memberId){

        List<WalkMateDto.Response> response = walkMateService.findWalksByMemberId(page, size, memberId, open);
        return new ResponseEntity(response, HttpStatus.OK);
    }


    @GetMapping("/walks")
    @ApiOperation("산책 게시글 조회")
    public ResponseEntity<List<WalkMateDto.Response>> getWalks(@ApiParam("모집 여부") @RequestParam("openFilter") boolean open,
                                                   @ApiParam("지역")@RequestParam("location") String location,
                                                   @ApiParam("page") @RequestParam("page") int page,
                                                   @ApiParam("size") @RequestParam("size") int size){

        List<WalkMateDto.Response> response = walkMateService.recentPage(page, size, location, open);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/have/comments/{member-id}")
    @ApiOperation("산책 게시글 조회(특정 회원이 댓글 달은 모든 게시글)")
    public ResponseEntity<List<WalkMateDto.Response>> getCommentedWalk(@ApiParam("회원 ID") @PathVariable("member-id") long memberId){

        List<WalkMateDto.Response> response = walkMateService.findCommentedWalks(memberId);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @DeleteMapping("/{walk-id}/{member-id}")
    @ApiOperation("산책 게시글 삭제")
    public ResponseEntity deleteWalk(@ApiParam("게시글 ID") @PathVariable("walk-id") long walkId,
                                     @ApiParam("회원 ID") @PathVariable("member-id") long memberId){

        walkMateService.deleteWalk(walkId, memberId);

        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/like/{walk-id}/{member-id}")
    @ApiOperation("산책 게시글 좋아요")
    public ResponseEntity<WalkMateDto.Like> likeWalk(@ApiParam("게시글 ID") @PathVariable("walk-id") long walkId,
                                   @ApiParam("회원 ID") @PathVariable("member-id") long memberId){

        WalkMateDto.Like response = walkMateService.likeByMember(walkId, memberId);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PatchMapping("/openstatus/{status}/{walk-id}/{member-id}")
    @ApiOperation("모집 여부만 수정")
    public ResponseEntity<WalkMateDto.Open> changeOpenStatus(@ApiParam("모집 여부") @PathVariable("status") boolean status,
                                           @ApiParam("게시글 ID") @PathVariable("walk-id") long walkId,
                                           @ApiParam("회원 ID") @PathVariable("member-id") long memberId){

        WalkMateDto.Open response = walkMateService.changeOpenStatus(status, walkId, memberId);
        return new ResponseEntity(response, HttpStatus.OK);
    }
}
