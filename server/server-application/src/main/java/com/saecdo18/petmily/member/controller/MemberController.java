package com.saecdo18.petmily.member.controller;

import com.saecdo18.petmily.member.dto.FollowMemberDto;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.FollowMember;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.mapper.MemberMapper;
import com.saecdo18.petmily.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;

@RestController
@Validated
@CrossOrigin
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberMapper memberMapper;
    private final MemberService memberService;
    private final static String MEMBER_CREATE_URI = "localhost:8080/members";

    @PostMapping
    public ResponseEntity postMember(@Valid @RequestBody MemberDto.Post memberPostDto){
        Member mappingMember = memberMapper.memberPostDtoToMember(memberPostDto);

        Member member = memberService.createMember(mappingMember);
        MemberDto.Response responseDto = memberMapper.memberToMemberResponseDto(member);

//        URI location = memberService.uriBuilder(memberId, MEMBER_CREATE_URI);

        return new ResponseEntity(responseDto,HttpStatus.CREATED);
//        return ResponseEntity.created(location).build();
    }

    @GetMapping("/{member-id}")
    public ResponseEntity getMember(@PathVariable("member-id") long memberId){
        MemberDto.Response responseMember = memberService.getMember(memberId);
        return new ResponseEntity(responseMember, HttpStatus.OK);
    }

    @PatchMapping("/status/{member-id}")
    public ResponseEntity patchMember(@PathVariable("member-id") long memberId,
                                      @Valid @RequestBody MemberDto.Patch memberPatchDto){
        MemberDto.Response responseMember = memberService.updateMemberStatus(memberId,
                memberPatchDto.getNickname(),
                memberPatchDto.getAddress());
        return new ResponseEntity(responseMember, HttpStatus.OK);
    }

    @PostMapping("/following/{follower-id}/{following-id}")
    public ResponseEntity followingMember(@PathVariable("follower-id") long followerId,
                                          @PathVariable("following-id") long followingId){
        FollowMemberDto.Response response = memberService.followMember(followerId,followingId);

        return new ResponseEntity(response,HttpStatus.OK);
    }



//    @PatchMapping("/statusmessage/{member-id}")
//    public ResponseEntity patchMemberStatusMessage(@PathVariable("member-id") long memberId,
//                                                   @Valid @RequestBody MemberDto.PatchMessage memberPatchMessageDto){
//        Member member = memberService.updateMemberStatusMessage(memberId, memberPatchMessageDto.getStatusMessage());
//
//        MemberDto.Response responseMember = memberMapper.memberToMemberResponseDto(member);
//
//        return new ResponseEntity<>(responseMember, HttpStatus.OK);
//    }

}
