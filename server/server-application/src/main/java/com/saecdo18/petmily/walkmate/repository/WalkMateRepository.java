package com.saecdo18.petmily.walkmate.repository;

import com.saecdo18.petmily.walkmate.entity.WalkMate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalkMateRepository extends JpaRepository<WalkMate, Long> {

//    List<WalkMate> findAllDesc();
}
