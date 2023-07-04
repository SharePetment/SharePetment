package com.saecdo18.petmily.feed.repository;

import com.saecdo18.petmily.feed.entity.Feed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedRepository extends JpaRepository<Feed, Long> {
    Page<Feed> findAll(Pageable pageable);
}
