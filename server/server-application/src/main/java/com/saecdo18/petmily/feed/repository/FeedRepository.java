package com.saecdo18.petmily.feed.repository;

import com.saecdo18.petmily.feed.entity.Feed;
import com.saecdo18.petmily.member.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface FeedRepository extends JpaRepository<Feed, Long> {
    Page<Feed> findAll(Pageable pageable);

    Page<Feed> findAllByMemberOrderByCreatedAtDesc(Member member, Pageable pageable);

    Page<Feed> findAllByMemberNot(Member member, Pageable pageable);

    List<Feed> findAllByFeedIdIn(ArrayList<Long> longs);

    Feed findFirstByMemberOrderByCreatedAtDesc(Member member);

}
