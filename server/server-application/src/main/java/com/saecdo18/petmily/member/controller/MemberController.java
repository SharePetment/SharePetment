package com.saecdo18.petmily.member.controller;

import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.member.dto.FollowMemberDto;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.FollowMember;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.mapper.MemberMapper;
import com.saecdo18.petmily.member.service.MemberService;
import io.swagger.annotations.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.*;


import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberMapper memberMapper;
    private final MemberService memberService;

    //    @PostMapping
//    public ResponseEntity postMember(@Valid @RequestBody MemberDto.Post memberPostDto) {
//        Member mappingMember = memberMapper.memberPostDtoToMember(memberPostDto);
//
//        Member member = memberService.createMember(mappingMember);
//        MemberDto.Response responseDto = memberMapper.memberToMemberResponseDto(member);
//
////        URI location = memberService.uriBuilder(memberId, MEMBER_CREATE_URI);
//
//        return new ResponseEntity(responseDto, HttpStatus.CREATED);
////        return ResponseEntity.created(location).build();
//    }


    @GetMapping("/{host-member-id}/{guest-member-id}")
    @Operation(summary = "Get Member", description = "회원 조회")
    public ResponseEntity<MemberDto.Response> getMember(@ApiParam("조회될 사용자 식별자") @PathVariable("host-member-id") long hostMemberId,
                                                        @ApiParam("조회할 사용자 식별자") @PathVariable("guest-member-id") long guestMemberId) {
        MemberDto.Response responseMember = memberService.getMember(hostMemberId, guestMemberId);
        return new ResponseEntity(responseMember, HttpStatus.OK);
    }

    @PatchMapping("/status/{member-id}")
    @ApiOperation(value = "requestbody :  {\"nickname\":\"나만의 닉네임\", \"address\":\"서울시 강서구 마곡동\"}")
    public ResponseEntity<MemberDto.Response> patchMember(@ApiParam("수정할 사용자 식별자") @PathVariable("member-id") long memberId,
                                                          @ApiParam("수정 사항") @RequestBody MemberDto.Patch memberPatchDto) {
        MemberDto.Response responseMember = memberService.updateMemberStatus(memberId,
                memberPatchDto.getNickname(),
                memberPatchDto.getAddress());
        return new ResponseEntity(responseMember, HttpStatus.OK);
    }

    @PostMapping("/following/{follower-id}/{following-id}")
    public ResponseEntity<FollowMemberDto.Response> followingMember(@ApiParam("팔로우 당할 사용자") @PathVariable("follower-id") long followerId,
                                                                    @ApiParam("팔로우 할 사용자") @PathVariable("following-id") long followingId) {
        FollowMemberDto.Response response = memberService.followMember(followerId, followingId);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/following/list/{following-id}")
    @Operation(summary = "Get FollowingList", description = "팔로우회원 조회")
    public ResponseEntity<List<FollowMemberDto.Response>> followingList(@ApiParam("팔로우 한 사용자") @PathVariable("following-id") long followingId) {
        List<FollowMemberDto.Response> responses = memberService.followList(followingId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PatchMapping("/image/{member-id}/{pet-id}")
    public ResponseEntity<MemberDto.Info> changeImage(@ApiParam("이미지 변경할 사용자") @PathVariable("member-id") long memberId,
                                                      @ApiParam("변경할 이미지의 반려동물") @PathVariable("pet-id") long petId) {
        MemberDto.Info response = memberService.changeImage(memberId, petId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/nickname-check/{nickname}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<MemberDto.NickCheckResponse> checkNickname(@ApiParam("중복 확인 할 닉네임") @PathVariable String nickname) {

        MemberDto.NickCheckResponse response = memberService.checkNickname(nickname);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{member-id}")
    @ApiOperation(value = "멤버 삭제 메서드!!! 함부로 삭제하지 마시구 사용자 조회를 통해 자신의 아이디를 우선 조회하세요!")
    public ResponseEntity<?> deleteMember(@ApiParam("삭제할 멤버 아이디") @PathVariable("member-id") long memberId) {
        memberService.deleteMember(memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
