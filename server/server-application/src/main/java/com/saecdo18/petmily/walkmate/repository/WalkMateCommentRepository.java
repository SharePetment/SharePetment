package com.saecdo18.petmily.walkmate.repository;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WalkMateCommentRepository extends JpaRepository<WalkMateComment, Long> {
    Optional<List<WalkMateComment>> findByMember(Member member);
}
