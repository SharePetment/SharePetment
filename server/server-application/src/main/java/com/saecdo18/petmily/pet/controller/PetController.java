package com.saecdo18.petmily.pet.controller;

import com.saecdo18.petmily.pet.PetMapper;
import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.Pet;
import com.saecdo18.petmily.pet.repository.PetRepository;
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

        PetDto.Response responsePet = petService.createPet(memberId, mappingPet);


        return new ResponseEntity<>(responsePet, HttpStatus.CREATED);
    }

    @GetMapping("/{pet-id}")
    public ResponseEntity getPet(@PathVariable("pet-id") long petId){
        PetDto.Response response = petService.getPet(petId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/status/{member-id}/{pet-id}")
    public ResponseEntity patchPet(@PathVariable("member-id") long memberId,
                                   @PathVariable("pet-id") long petId,
                                   @Valid @RequestBody PetDto.Patch petPatchDto){
        Pet pet = petMapper.petPatchDtoToPet(petPatchDto);
        PetDto.Response response = petService.updatePet(memberId, petId, pet);

        return new ResponseEntity<>(response,HttpStatus.OK);
    }
}
