package com.saecdo18.petmily.walkmate.repository;

import com.saecdo18.petmily.walkmate.entity.WalkMate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalkMateRepository extends JpaRepository<WalkMate, Long> {

    //    List<WalkMate> findAllDesc();
    Page<WalkMate> findByLocation(Pageable pageable, String location);
}