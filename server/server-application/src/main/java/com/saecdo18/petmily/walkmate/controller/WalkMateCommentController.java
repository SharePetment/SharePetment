package com.saecdo18.petmily.walkmate.controller;

import com.saecdo18.petmily.walkmate.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.mapper.WalkMateCommentMapper;
import com.saecdo18.petmily.walkmate.service.WalkMateCommentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/walkmates/comments")
@Api(value = "WalkMateComment 컨트롤러 API", tags = "WalkMateComment API")
public class WalkMateCommentController {

    private final WalkMateCommentService walkMateCommentService;
    private final WalkMateCommentMapper mapper;

    public WalkMateCommentController(WalkMateCommentService walkMateCommentService, WalkMateCommentMapper mapper) {
        this.walkMateCommentService = walkMateCommentService;
        this.mapper = mapper;
    }

    @PostMapping("/{walk-id}/{member-id}")
    @ApiOperation("산책 게시글 댓글 등록")
    private ResponseEntity<WalkMateCommentDto.Response> postComment(@ApiParam("게시글 ID") @PathVariable("walk-id") long walkId,
                                                                    @ApiParam("회원 ID") @PathVariable("member-id") long memberId,
                                                                    @ApiParam("댓글 등록 Dto") @RequestBody WalkMateCommentDto.Post commentPostDto){

        WalkMateCommentDto.Response response = walkMateCommentService.createComments(commentPostDto, walkId, memberId);

        return new ResponseEntity(response, HttpStatus.CREATED);
    }

    @GetMapping("/bywalk/{walk-id}")
    @ApiOperation("산책 게시글 댓글 조회(산책 게시글 ID)")
    private ResponseEntity<List<WalkMateCommentDto.Response>> getCommentsByWalk(@ApiParam("게시글 ID") @PathVariable("walk-id") long walkId){

        List<WalkMateCommentDto.Response> response = walkMateCommentService.findCommentsByWalkId(walkId);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/bymember/{member-id}")
    @ApiOperation("산책 게시글 댓글 조회(회원 ID)")
    private ResponseEntity<List<WalkMateCommentDto.Response>> getCommentsByMember(@ApiParam("회원 ID") @PathVariable("member-id") long memberId) {

        List<WalkMateCommentDto.Response> response = walkMateCommentService.findCommentsByMemberId(memberId);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/allcomments")
    @ApiOperation("산책 게시글 댓글 조회")
    private ResponseEntity<List<WalkMateCommentDto.Response>> getAllComments(){

        List<WalkMateCommentDto.Response> response = walkMateCommentService.findAllComments();

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PatchMapping("/{comment-id}/{member-id}")
    @ApiOperation("산책 게시글 댓글 수정")
    private ResponseEntity<WalkMateCommentDto.Response> patchComment(@ApiParam("댓글 ID") @PathVariable("comment-id") long commentId,
                                                                     @ApiParam("회원 ID") @PathVariable("member-id") long memberId,
                                                                     @ApiParam("댓글 수정 Dto") @RequestBody WalkMateCommentDto.Patch commentPatchDto) {

        WalkMateCommentDto.Response response = walkMateCommentService.updateComment(commentPatchDto, commentId, memberId);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @DeleteMapping("/{comment-id}/{member-id}")
    @ApiOperation("산책 게시글 댓글 삭제")
    private ResponseEntity deleteComment(@ApiParam("댓글 ID") @PathVariable("comment-id") long commentId,
                                         @ApiParam("회원 ID") @PathVariable("member-id") long memberId){

        walkMateCommentService.deleteComment(commentId, memberId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

}
