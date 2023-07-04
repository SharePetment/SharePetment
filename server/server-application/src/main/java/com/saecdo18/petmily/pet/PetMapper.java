package com.saecdo18.petmily.pet;

import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.Pet;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PetMapper {
    Pet petPostDtoToPet(PetDto.Post petPostDto);


    PetDto.Response petToPetResponseDto(Pet pet);
}
