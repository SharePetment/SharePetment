package com.saecdo18.petmily.pet.mapper;

import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.image.entity.Image;
import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.Pet;
import org.mapstruct.Mapper;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PetMapper {
    Pet petPostDtoToPet(PetDto.Post petPostDto);

    Pet petPatchDtoToPet(PetDto.Patch petPatchDto);

    PetDto.Response petToPetResponseDto(Pet pet);
    ImageDto imageToImageDto(Image image);


    List<PetDto.Response> petsToPetResponseDtos(List<Pet> petList);
}
