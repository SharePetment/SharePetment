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



    @GetMapping
    @Operation(summary = "자신 정보 조회", description = "회원 조회")
    public ResponseEntity<MemberDto.Response> getMember() {
        long memberId = authenticationGetMemberId.getMemberId();
        MemberDto.Response responseMember = memberService.getMember(memberId, memberId);
        return new ResponseEntity(responseMember, HttpStatus.OK);
    }

    @GetMapping("/{host-member-id}")
    @Operation(summary = "타인 정보 조회", description = "회원 조회")
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
    @Operation(summary = "팔로잉 신청하기", description = "follower-id에 팔로잉 할 id")
    public ResponseEntity<FollowMemberDto.Response> followingMember(@ApiParam("팔로우 당할 사용자") @PathVariable("follower-id") long followerId) {
        long followingId = authenticationGetMemberId.getMemberId();
        FollowMemberDto.Response response = memberService.followMember(followerId, followingId);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @GetMapping("/following/list")
    @Operation(summary = "자신이 팔로잉 한 회원 조회", description = "자신의 마이페이지에서 팔로잉리스트 보기 위함")
    public ResponseEntity<List<FollowMemberDto.Response>> followingList() {
        long followingId = authenticationGetMemberId.getMemberId();

        List<FollowMemberDto.Response> responses = memberService.followList(followingId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/following/list/{following-id}")
    @Operation(summary = "타인이 팔로잉 한 회원 조회", description = "타인의 마이페이지에서 팔로잉리스트 보기 위함")
    public ResponseEntity<List<FollowMemberDto.Response>> followingList(@ApiParam("조회될 사용자 식별자") @PathVariable("following-id") long followingId) {

        List<FollowMemberDto.Response> responses = memberService.followList(followingId);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PatchMapping("/image/{pet-id}")
    @Operation(summary = "회원 프로필 변경하기", description = "펫 아이디를 넣으면 해당 펫 이미지가 회원 대표 이미지로 선정")
    public ResponseEntity<MemberDto.Info> changeImage(@ApiParam("변경할 이미지의 반려동물") @PathVariable("pet-id") long petId) {
        long memberId = authenticationGetMemberId.getMemberId();

        MemberDto.Info response = memberService.changeImage(memberId, petId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/nickname-check/{nickname}")
    @PreAuthorize("permitAll()")
    @Operation(summary = "닉네임 중복 확인하기", description = "별도의 토큰 필요없이 닉네임만 적어서 보내주시면 됩니다")
    public ResponseEntity<MemberDto.NickCheckResponse> checkNickname(@ApiParam("중복 확인 할 닉네임") @PathVariable String nickname) {

        MemberDto.NickCheckResponse response = memberService.checkNickname(nickname);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{member-id}")
    @ApiOperation(value = "멤버 삭제 메서드!!! 함부로 삭제하지 마시구 사용자 조회를 통해 자신의 아이디를 우선 조회하세요!")
    public ResponseEntity<?> deleteMember(@ApiParam @PathVariable("member-id") long memberId) {
//        long memberId = authenticationGetMemberId.getMemberId();

        memberService.deleteMember(memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
