package com.saecdo18.petmily.walkmate.repository;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import com.saecdo18.petmily.walkmate.entity.WalkMateLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WalkLikeRepository extends JpaRepository<WalkMateLike, Long> {

    Optional<WalkMateLike> findByWalkAndMember(WalkMate walk, Member member);
}
