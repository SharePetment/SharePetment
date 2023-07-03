package com.saecdo18.petmily.feeds.repository;

import com.saecdo18.petmily.feeds.entity.Feed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedRepository extends JpaRepository<Feed, Long> {
}
