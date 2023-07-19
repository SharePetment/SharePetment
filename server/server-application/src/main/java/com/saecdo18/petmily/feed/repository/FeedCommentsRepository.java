package com.saecdo18.petmily.feed.repository;

import com.saecdo18.petmily.feed.entity.FeedComments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedCommentsRepository extends JpaRepository<FeedComments, Long> {

    Optional<List<FeedComments>> findByFeedFeedId(long feedId);
}
