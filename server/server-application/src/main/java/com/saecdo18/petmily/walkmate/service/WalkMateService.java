package com.saecdo18.petmily.walkmate.service;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.entity.WalkMateLike;
import com.saecdo18.petmily.walkmate.repository.WalkLikeRepository;
import com.saecdo18.petmily.walkmate.repository.WalkMateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WalkMateService {

    private final WalkMateRepository walkMateRepository;
    private final WalkLikeRepository walkLikeRepository;
    private final MemberRepository memberRepository;

    public WalkMateService(WalkMateRepository walkMateRepository,
                           WalkLikeRepository walkLikeRepository,
                           MemberRepository memberRepository) {
        this.walkMateRepository = walkMateRepository;
        this.walkLikeRepository = walkLikeRepository;
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

    public WalkMateDto.Like likeByMember(long walkId, long memberId){
        WalkMate findWalk = methodFindByWalkId(walkId);
        Member finMember = methodFindByMemberId(memberId);

        Optional<WalkMateLike> optionalWalkMateLike =
                walkLikeRepository.findByWalkAndMember(findWalk, finMember);

        WalkMateLike walkMateLike;
        if(optionalWalkMateLike.isEmpty()){
            walkMateLike = WalkMateLike.builder()
                    .walk(findWalk)
                    .member(finMember)
                    .build();
            findWalk.likeCount(true);
        } else {
            walkMateLike = optionalWalkMateLike.get();
            walkMateLike.updateIsLikes();
            findWalk.likeCount(walkMateLike.isLike());
        }
        WalkMateLike savedWalkMateLike = walkLikeRepository.save(walkMateLike);
        WalkMate savedWalk = walkMateRepository.save(findWalk);

        return WalkMateDto.Like.builder()
                .likeCount(savedWalk.getLikeCount())
                .isLike(savedWalkMateLike.isLike())
                .build();
    }

    //-------------------------------------------------------------------//

    private WalkMate methodFindByWalkId(long walkId){
        return walkMateRepository.findById(walkId).orElseThrow(
                () -> new RuntimeException("산책 게시글을 찾을 수 없습니다.")
        );
    }

    private Member methodFindByMemberId(long memberId){
        return memberRepository.findById(memberId).orElseThrow(
                () -> new RuntimeException("사용자를 찾을 수 없습니다.")
        );
    }

}
