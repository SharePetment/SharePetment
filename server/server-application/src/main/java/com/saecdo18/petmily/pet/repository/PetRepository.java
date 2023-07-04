package com.saecdo18.petmily.pet.repository;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.pet.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PetRepository extends JpaRepository<Pet, Long> {
    Optional<Pet> findByMember(Member member);
}
