package com.saecdo18.petmily.member.controller;

import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.member.dto.FollowMemberDto;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.FollowMember;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.mapper.MemberMapper;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.member.service.MemberService;
import com.saecdo18.petmily.util.AuthenticationGetMemberId;
import io.swagger.annotations.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final MemberRepository memberRepository;
    private final AuthenticationGetMemberId authenticationGetMemberId;



    @GetMapping("/{host-member-id}")
    @Operation(summary = "Get Member", description = "회원 조회")
    public ResponseEntity<MemberDto.Response> getMember(@ApiParam("조회될 사용자 식별자") @PathVariable("host-member-id") long hostMemberId) {
        long guestMemberId = authenticationGetMemberId.getMemberId();
        MemberDto.Response responseMember = memberService.getMember(hostMemberId, guestMemberId);
        return new ResponseEntity(responseMember, HttpStatus.OK);
    }

    @PatchMapping("/status")
    @ApiOperation(value = "requestbody :  {\"nickname\":\"나만의 닉네임\", \"address\":\"서울시 강서구 마곡동\"}")
    public ResponseEntity<MemberDto.Response> patchMember(@ApiParam("수정 사항") @RequestBody MemberDto.Patch memberPatchDto) {
        long memberId = authenticationGetMemberId.getMemberId();

        MemberDto.Response responseMember = memberService.updateMemberStatus(memberId,
                memberPatchDto.getNickname(),
                memberPatchDto.getAddress());
        return new ResponseEntity(responseMember, HttpStatus.OK);
    }

    @PostMapping("/following/{follower-id}")
    public ResponseEntity<FollowMemberDto.Response> followingMember(@ApiParam("팔로우 당할 사용자") @PathVariable("follower-id") long followerId) {
        long followingId = authenticationGetMemberId.getMemberId();
        FollowMemberDto.Response response = memberService.followMember(followerId, followingId);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/following/list")
    @Operation(summary = "Get FollowingList", description = "팔로우회원 조회")
    public ResponseEntity<List<FollowMemberDto.Response>> followingList() {
        long followingId = authenticationGetMemberId.getMemberId();

        List<FollowMemberDto.Response> responses = memberService.followList(followingId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PatchMapping("/image/{pet-id}")
    public ResponseEntity<MemberDto.Info> changeImage(@ApiParam("변경할 이미지의 반려동물") @PathVariable("pet-id") long petId) {
        long memberId = authenticationGetMemberId.getMemberId();

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
    public ResponseEntity<?> deleteMember(@ApiParam @PathVariable long memberId) {
//        long memberId = authenticationGetMemberId.getMemberId();

        memberService.deleteMember(memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
