package com.saecdo18.petmily.feed.service;

import com.saecdo18.petmily.feed.dto.FeedCommentDto;
import com.saecdo18.petmily.feed.entity.Feed;
import com.saecdo18.petmily.feed.entity.FeedComments;
import com.saecdo18.petmily.feed.mapper.FeedMapper;
import com.saecdo18.petmily.feed.repository.FeedCommentsRepository;
import com.saecdo18.petmily.feed.repository.FeedRepository;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeedCommentServiceImpl implements FeedCommentService{

    private final FeedCommentsRepository feedCommentsRepository;
    private final FeedRepository feedRepository;
    private final MemberRepository memberRepository;
    private final FeedMapper feedMapper;
    @Override
    public FeedCommentDto.Response createComment(FeedCommentDto.Post post) {
        Feed findFeed = methodFindByFeedId(post.getFeedId());
        Member findMember = methodFindByMemberId(post.getMemberId());
        FeedComments feedComments = FeedComments.builder()
                .content(post.getContent())
                .feed(findFeed)
                .member(findMember)
                .build();

        FeedComments saveComment = feedCommentsRepository.save(feedComments);
        FeedCommentDto.Response response = feedMapper.feedCommentsToFeedCommentDto(saveComment);
        response.setMemberInfo(memberIdToMemberInfoDto(findMember.getMemberId()));

        return response;
    }

    @Override
    public FeedCommentDto.Response updateComment(FeedCommentDto.Patch patch, long commentId, long memberId) {
        FeedComments feedComments = methodFindByCommentId(commentId);
        if(feedComments.getMember().getMemberId() != memberId)
            throw new RuntimeException("수정할 권한이 없습니다.");
        feedComments.updateContent(patch.getContent());
        FeedComments saveFeedComments = feedCommentsRepository.save(feedComments);
        FeedCommentDto.Response response = feedMapper.feedCommentsToFeedCommentDto(saveFeedComments);
        response.setMemberInfo(memberIdToMemberInfoDto(memberId));
        return response;
    }

    @Override
    public void deleteComment(long commentId, long memberId) {
        FeedComments feedComments = methodFindByCommentId(commentId);
        if(feedComments.getMember().getMemberId() != memberId)
            throw new RuntimeException("삭제할 권한이 없습니다.");

        feedCommentsRepository.delete(feedComments);
    }


    private FeedComments methodFindByCommentId(long commentId) {
        return feedCommentsRepository.findById(commentId).orElseThrow(
                () -> new RuntimeException("피드 댓글을 찾을 수 없습니다.")
        );
    }

    private Member methodFindByMemberId(long memberId) {
        return memberRepository.findById(memberId).orElseThrow(
                () -> new RuntimeException("사용자를 찾을 수 없습니다.")
        );
    }

    private Feed methodFindByFeedId(long feedId) {
        return feedRepository.findById(feedId).orElseThrow(
                () -> new RuntimeException("피드를 찾을 수 없습니다")
        );
    }

    private MemberDto.Info memberIdToMemberInfoDto(long memberId) {
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
