package com.saecdo18.petmily.member.controller;

import com.saecdo18.petmily.member.dto.MemberDto;
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

    @PatchMapping("/status/{member-id}")
    public ResponseEntity patchMember(@PathVariable("member-id") long memberId,
                                      @Valid @RequestBody MemberDto.Patch memberPatchDto){
        Member member = memberService.updateMemberStatus(memberId,
                memberPatchDto.getNickname(),
                memberPatchDto.getAddress());
        MemberDto.Response responseDto = memberMapper.memberToMemberResponseDto(member);
        return new ResponseEntity(responseDto, HttpStatus.OK);
    }

}
