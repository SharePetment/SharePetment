package com.saecdo18.petmily.feed.repository;

import com.saecdo18.petmily.feed.entity.Feed;
import com.saecdo18.petmily.feed.entity.FeedLike;
import com.saecdo18.petmily.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedLikeRepository extends JpaRepository<FeedLike, Long> {
    Optional<FeedLike> findByMemberAndFeed(Member member, Feed feed);
}
