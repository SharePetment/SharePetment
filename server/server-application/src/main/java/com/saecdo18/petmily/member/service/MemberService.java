package com.saecdo18.petmily.member.service;

import com.saecdo18.petmily.member.dto.FollowMemberDto;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.FollowMember;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.mapper.FollowMemberMapper;
import com.saecdo18.petmily.member.mapper.MemberMapper;
import com.saecdo18.petmily.member.repository.FollowMemberRepository;
import com.saecdo18.petmily.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final FollowMemberRepository followMemberRepository;
    private final MemberMapper memberMapper;
    private final FollowMemberMapper followMemberMapper;

    public Member createMember(Member member){
        Member findMember = methodVerifyNoneMember(member); //email를 통해 등록되지 않은 멤버이면 진행
        memberRepository.save(findMember);
        return findMember;
    }

    public MemberDto.Response getMember(long memberId){
        Member member = methodFindByMemberIdMember(memberId);

        return memberMapper.memberToMemberResponseDto(member);
    }

    public MemberDto.Response updateMemberStatus(long memberId, String nickname, String address){
        Member findMember = methodFindByMemberIdMember(memberId);
        findMember.update(nickname, address);
        MemberDto.Response responseMember = memberMapper.memberToMemberResponseDto(findMember);
        return responseMember;
    }

    public FollowMemberDto.Response followMember(long followerId,long followingId){
        Member findFollower = methodFindByFollowerInMember(followerId);
        Optional<FollowMember> optionalFollowMember = followMemberRepository.findByFollowerMemberAndFollowingId(findFollower, followingId);

        if (optionalFollowMember.isEmpty()){
            FollowMember followMember =FollowMember.builder()
                    .followerMember(findFollower)
                    .followingId(followingId)
                    .follow(true)
                    .build();
            followMemberRepository.save(followMember);

            FollowMemberDto.Response response = followMemberMapper.followMemberToFollowMemberResponseDto(followMember);
            return  response;
        }
        else{
            FollowMember followMember = optionalFollowMember.get();
            boolean follow = followMember.isFollow();
            followMember.updateFollow(!follow);

            FollowMemberDto.Response response = followMemberMapper.followMemberToFollowMemberResponseDto(followMember);
            return  response;
        }
    }

    public List<FollowMemberDto.Response> followList(long followingId){
        List<FollowMember> followMemberList = followMemberRepository.findByFollowingId(followingId);
        List<FollowMemberDto.Response> responses = followMemberMapper.followMemberToFollowMemberResponseDtos(followMemberList);
        return  responses;
    }

    private Member methodFindByFollowerInMember(long followerId) {
        return memberRepository.findById(followerId).orElseThrow(() -> new RuntimeException("팔로우 할 팔로워를 찾지 못했습니다"));
    }

    private Member methodFindByMemberIdMember(long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("수정할 멤버가 없습니다"));
    }


    private Member methodVerifyNoneMember(Member member) {
        Optional<Member> optionalMember = memberRepository.findByEmail(member.getEmail());
        if (optionalMember.isPresent()){
            throw new RuntimeException("이미 등록된 회원입니다");
        }
        return member;
    }

    public URI uriBuilder(long memberId, String basicURL) {
        return UriComponentsBuilder
                .fromUriString(basicURL)
                .path("/"+memberId)
                .build()
                .toUri();
    }

    //    public Member updateMemberStatusMessage(long memberId, String statusMessage){
//        Member findMember = methodFindByMemberIdMember(memberId);
//        findMember.updateMessage(statusMessage);
//        return findMember;
//    }
}
