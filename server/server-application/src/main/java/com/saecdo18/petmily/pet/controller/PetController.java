package com.saecdo18.petmily.pet.controller;

import com.saecdo18.petmily.pet.PetMapper;
import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.Pet;
import com.saecdo18.petmily.pet.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@Validated
@CrossOrigin
@RequestMapping("/pets")
@RequiredArgsConstructor
public class PetController {
    private final PetService petService;

    private final PetMapper petMapper;

    @PostMapping("/{member-id}")
    public ResponseEntity postPet(@PathVariable("member-id") long memberId,
                                  @Valid @RequestBody PetDto.Post petPostDto){
        Pet mappingPet = petMapper.petPostDtoToPet(petPostDto);

        Pet pet = petService.createPet(memberId, mappingPet);

        PetDto.Response responsePet = petMapper.petToPetResponseDto(pet);
        responsePet.setMemberId(pet.getMember().getMemberId());
//        responsePet.setWalkMated(pet.isWalkMated());

        return new ResponseEntity<>(responsePet, HttpStatus.CREATED);
    }
}
