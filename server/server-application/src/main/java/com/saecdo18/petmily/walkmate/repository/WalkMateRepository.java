package com.saecdo18.petmily.walkmate.repository;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.walkmate.entity.WalkMate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalkMateRepository extends JpaRepository<WalkMate, Long> {

    //    List<WalkMate> findAllDesc();
    Page<WalkMate> findByLocation(Pageable pageable, List<WalkMate> walkMates);
    Page<WalkMate> findByMember(Pageable pageable, Member member);
}