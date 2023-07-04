package com.saecdo18.petmily.walkmate.post.repository;

import com.saecdo18.petmily.walkmate.post.entity.WalkMate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalkMateRepository extends JpaRepository<WalkMate, Long> {

//    List<WalkMate> findAllDesc();
}
