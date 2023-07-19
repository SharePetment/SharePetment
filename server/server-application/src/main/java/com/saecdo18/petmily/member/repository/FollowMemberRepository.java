package com.saecdo18.petmily.member.repository;

import com.saecdo18.petmily.member.entity.FollowMember;
import com.saecdo18.petmily.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowMemberRepository extends JpaRepository<FollowMember, Long> {
    Optional<FollowMember> findByFollowerMemberAndFollowingId(Member followerMember, long followingId);

    Optional<List<FollowMember>> findByFollowingId(long followingId);


}
