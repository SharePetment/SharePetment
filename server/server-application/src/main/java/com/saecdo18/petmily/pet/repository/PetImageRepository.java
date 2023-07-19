package com.saecdo18.petmily.pet.repository;

import com.saecdo18.petmily.pet.entity.Pet;
import com.saecdo18.petmily.pet.entity.PetImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetImageRepository extends JpaRepository<PetImage, Long> {
    PetImage findByPet(Pet pet);
    PetImage findFirstByPetOrderByCreatedAtDesc(Pet pet);
    PetImage findFirstByPetOrderByCreatedAtAsc(Pet pet);
}
