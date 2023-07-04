package com.saecdo18.petmily.walkmate.post.service;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.post.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.post.entity.WalkMate;
import com.saecdo18.petmily.walkmate.post.repository.WalkMateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WalkMateService {

    private final WalkMateRepository walkMateRepository;
    private final MemberRepository memberRepository;

    public WalkMateService(WalkMateRepository walkMateRepository,
                           MemberRepository memberRepository) {
        this.walkMateRepository = walkMateRepository;
        this.memberRepository = memberRepository;
    }

    public WalkMate createWalk(WalkMate walkMate, long memberId) {

        Member member = memberRepository.findById(memberId).orElseThrow();
        walkMate.setMember(member);

        return walkMateRepository.save(walkMate);
    }

    public WalkMate findWalk(long walkMateId){

        Optional<WalkMate> optionalWalkMate = walkMateRepository.findById(walkMateId);
        WalkMate findWalk = optionalWalkMate.orElseThrow();

        return findWalk;
    }

    public List<WalkMate> findWalks(){

        return walkMateRepository.findAll();
    }

    public void deleteWalk(long walkMateId, long memberId){

        WalkMate walk = findWalk(walkMateId);

        if(memberId!=walk.getMember().getMemberId()){
            throw new IllegalArgumentException("삭제할 권한이 없습니다.");
        }

        walkMateRepository.delete(walk);
    }

    public WalkMate updateWalkMate(WalkMateDto.Patch walkPatchDto,
                                   long walkId, long memberId){

        WalkMate walk = findWalk(walkId);

        if(memberId!=walk.getMember().getMemberId()){
            throw new IllegalArgumentException("수정할 권한이 없습니다.");
        }

        walk.updateWalk(
                walkPatchDto.getTitle(),
                walkPatchDto.getContent(),
                walkPatchDto.getMapURL(),
                walkPatchDto.getChatURL(),
                walkPatchDto.getLocation(),
                walkPatchDto.getTime(),
                walkPatchDto.getOpen(),
                walkPatchDto.getMaximum());

        return walkMateRepository.save(walk);
    }

}
