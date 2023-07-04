package com.saecdo18.petmily.walkmate.comment.repository;

import com.saecdo18.petmily.walkmate.comment.entity.WalkMateComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalkMateCommentRepository extends JpaRepository<WalkMateComment, Long> {
}
