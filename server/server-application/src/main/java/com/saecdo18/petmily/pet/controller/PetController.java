package com.saecdo18.petmily.pet.controller;

import com.saecdo18.petmily.pet.mapper.PetMapper;
import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.Pet;
import com.saecdo18.petmily.pet.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@Validated
@CrossOrigin
@RequestMapping("/pets")
@RequiredArgsConstructor
public class PetController {
    private final PetService petService;
    private final PetMapper petMapper;

    @PostMapping
    public ResponseEntity<?> postPet(@RequestParam("memberId") long memberId,
                                     @RequestParam("images") MultipartFile images,
                                     @RequestParam("name") String name,
                                     @RequestParam("age") int age,
                                     @RequestParam("sex") String sex,
                                     @RequestParam("species") String species,
                                     @RequestParam("information") String information,
                                     @RequestParam("walkMated") boolean walkMated) throws IOException {

        PetDto.Post petPostDto = PetDto.Post.builder()
                .images(images)
                .name(name)
                .age(age)
                .sex(sex)
                .species(species)
                .information(information)
                .walkMated(walkMated)
                .build();
//        Pet mappingPet = petMapper.petPostDtoToPet(petPostDto);
        PetDto.Response responsePet = petService.createPet(memberId, petPostDto);


        return new ResponseEntity<>(responsePet, HttpStatus.CREATED);
    }

    @GetMapping("/{pet-id}")
    public ResponseEntity getPet(@PathVariable("pet-id") long petId) {
        PetDto.Response response = petService.getPet(petId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PatchMapping("/status/{member-id}/{pet-id}")
    public ResponseEntity patchPet(@PathVariable("member-id") long memberId,
                                   @PathVariable("pet-id") long petId,
                                   @RequestParam("images") MultipartFile[] images,
                                   @RequestParam("deleteImage") String[] deleteImages,
                                   @RequestParam("name") String name,
                                   @RequestParam("age") int age,
                                   @RequestParam("sex") String sex,
                                   @RequestParam("species") String species,
                                   @RequestParam("information") String information,
                                   @RequestParam("walkMated") boolean walkMated) throws IOException {
        PetDto.Patch petPatchDto = PetDto.Patch.builder()
                .addImages(List.of(images))
                .deleteImages(List.of(deleteImages))
                .name(name)
                .age(age)
                .sex(sex)
                .species(species)
                .information(information)
                .walkMated(walkMated)
                .build();
        PetDto.Response response = petService.updatePet(memberId, petId, petPatchDto);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{member-id}/{pet-id}")
    public ResponseEntity<?> deletePet(@PathVariable("member-id") long memberId,
                                       @PathVariable("pet-id") long petId) {
        petService.deletePet(memberId, petId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
