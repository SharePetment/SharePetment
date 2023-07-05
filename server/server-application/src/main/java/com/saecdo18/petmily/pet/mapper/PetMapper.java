package com.saecdo18.petmily.pet.mapper;

import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.Pet;
import org.mapstruct.Mapper;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PetMapper {
    Pet petPostDtoToPet(PetDto.Post petPostDto);

    Pet petPatchDtoToPet(PetDto.Patch petPatchDto);

    default PetDto.Response petToPetResponseDto(Pet pet){
        PetDto.Response.ResponseBuilder response = PetDto.Response.builder();

        response.petId( pet.getPetId() );
        response.profile( pet.getProfile() );
        response.name( pet.getName() );
        response.age( pet.getAge() );
        response.sex( pet.getSex() );
        response.species( pet.getSpecies() );
        response.information( pet.getInformation() );
        response.walkMated( pet.isWalkMated() );
        response.memberId(pet.getMember().getMemberId());
        if ( pet.getCreatedAt() != null ) {
            response.createdAt( DateTimeFormatter.ISO_LOCAL_DATE_TIME.format( pet.getCreatedAt() ) );
        }
        if ( pet.getModifiedAt() != null ) {
            response.modifiedAt( DateTimeFormatter.ISO_LOCAL_DATE_TIME.format( pet.getModifiedAt() ) );
        }

        return response.build();
    }

    List<PetDto.Response> petsToPetResponseDtos(List<Pet> petList);
}
