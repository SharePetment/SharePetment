package com.saecdo18.petmily.walkmate.repository;

import com.saecdo18.petmily.walkmate.entity.WalkMateComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalkMateCommentRepository extends JpaRepository<WalkMateComment, Long> {
}
