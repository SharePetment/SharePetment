package com.saecdo18.petmily.walkmate.service;

import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.walkmate.dto.WalkMateCommentDto;
import com.saecdo18.petmily.walkmate.dto.WalkMateDto;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import com.saecdo18.petmily.walkmate.entity.WalkMateLike;
import com.saecdo18.petmily.walkmate.mapper.WalkMateMapper;
import com.saecdo18.petmily.walkmate.repository.WalkLikeRepository;
import com.saecdo18.petmily.walkmate.repository.WalkMateCommentRepository;
import com.saecdo18.petmily.walkmate.repository.WalkMateRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WalkMateService {

    private final WalkMateRepository walkMateRepository;
    private final WalkMateCommentRepository walkMateCommentRepository;
    private final WalkLikeRepository walkLikeRepository;
    private final MemberRepository memberRepository;
    private final WalkMateCommentService walkMateCommentService;
    private final WalkMateMapper walkMateMapper;

    public WalkMateService(WalkMateRepository walkMateRepository,
                           WalkMateCommentRepository walkMateCommentRepository,
                           WalkLikeRepository walkLikeRepository,
                           MemberRepository memberRepository,
                           WalkMateCommentService walkMateCommentService,
                           WalkMateMapper walkMateMapper) {
        this.walkMateRepository = walkMateRepository;
        this.walkMateCommentRepository = walkMateCommentRepository;
        this.walkLikeRepository = walkLikeRepository;
        this.memberRepository = memberRepository;
        this.walkMateCommentService = walkMateCommentService;
        this.walkMateMapper = walkMateMapper;
    }

    public WalkMate createWalk(WalkMate walkMate, long memberId) {

        Member member = memberRepository.findById(memberId).orElseThrow();
        walkMate.setMember(member);

        return walkMateRepository.save(walkMate);
    }

    public WalkMate findWalkByWalkId(long walkMateId){

        WalkMate walk = walkMateRepository.findById(walkMateId).orElseThrow();
        return walk;
    }

    public WalkMateDto.Response findWalk(long walkMateId){

        WalkMate walk = walkMateRepository.findById(walkMateId).orElseThrow();
        WalkMateDto.Response response = walkMateMapper.walkMateToWalkMateResponseDto(walk);
        List<WalkMateComment> allComments = walkMateCommentService.findCommentsByWalkId(walkMateId);
        List<WalkMateCommentDto.Response> comments = allComments.stream()
                .map(comment -> walkMateCommentService.findComment(comment.getWalkMateCommentId()))
                .collect(Collectors.toList());

        response.setComments(comments);

        Member member = methodFindByMemberId(walk.getMember().getMemberId());
        MemberDto.Info info = MemberDto.Info.builder()
                .memberId(member.getMemberId())
                .imageURL(member.getImageURL())
                .nickname(member.getNickname())
                .build();
        response.setMemberInfo(info);

        return response;
    }


    public List<WalkMate> findWalks(){

        return walkMateRepository.findAll();
    }

    public void deleteWalk(long walkMateId, long memberId){

        WalkMate walk = findWalkByWalkId(walkMateId);

        if(memberId!=walk.getMember().getMemberId()){
            throw new IllegalArgumentException("삭제할 권한이 없습니다.");
        }

        for(WalkMateComment comment : walk.getComments()){
            walkMateCommentRepository.delete(comment);
        }

        walk.setComments(null);
        walkMateRepository.delete(walk);
    }

    public WalkMate updateWalkMate(WalkMateDto.Patch walkPatchDto,
                                   long walkId, long memberId){

        WalkMate walk = findWalkByWalkId(walkId);

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

    public List<WalkMate> searchWalksMatchWithLocation(String location){

        List<WalkMate> allWalks = findWalks();
        List<WalkMate> matchWalks = allWalks.stream()
                .filter(walk -> walk.getLocation().equals(location))
                .collect(Collectors.toList());

        return matchWalks;
    }

    public List<WalkMate> recentPage(int page, int size, String location, boolean openFilter){


        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<WalkMate> response = walkMateRepository.findByLocation(pageRequest, location).getContent();

        if(openFilter){
            onlyOpenWalk(response);
        }

        return response;

    }

    public WalkMateDto.Open changeOpenStatus(boolean status, long walkId, long memberId){

        WalkMate walk = findWalkByWalkId(walkId);

        if(memberId!=walk.getMember().getMemberId()){
            throw new IllegalArgumentException("수정할 권한이 없습니다.");
        }

        WalkMateDto.Open response = WalkMateDto.Open.builder()
                .walkMatePostId(walkId)
                .open(status)
                .build();

        return response;
    }

    public List<WalkMate> onlyOpenWalk(List<WalkMate> walkMates){

        List<WalkMate> allWalks = findWalks();
        List<WalkMate> openWalks = allWalks.stream()
                .filter(walk -> walk.getOpen().equals(true))
                .collect(Collectors.toList());

        return openWalks;
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

    private MemberDto.Info memberIdToMemberInfoDto(long memberId){
        Member findMember = memberRepository.findById(memberId).orElseThrow(
                () -> new RuntimeException("사용자를 찾을 수 없습니다.")
        );

        return MemberDto.Info.builder()
                .memberId(findMember.getMemberId())
                .imageURL(findMember.getImageURL())
                .nickname(findMember.getNickname())
                .build();
    }

}