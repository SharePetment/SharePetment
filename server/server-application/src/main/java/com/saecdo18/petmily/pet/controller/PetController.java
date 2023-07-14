package com.saecdo18.petmily.pet.controller;

import com.saecdo18.petmily.pet.mapper.PetMapper;
import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.Pet;
import com.saecdo18.petmily.pet.service.PetService;
import com.saecdo18.petmily.util.AuthenticationGetMemberId;
import io.swagger.annotations.ApiParam;
import io.swagger.v3.oas.annotations.Operation;
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

    private final AuthenticationGetMemberId authenticationGetMemberId;

    @PostMapping
    @Operation(summary = "펫 등록하기", description = "폼데이터 형식으로 주셔야 합니다")
    public ResponseEntity<PetDto.Response> postPet(@ApiParam("반려동물 이미지")@RequestParam("images") MultipartFile images,
                                                   @ApiParam("반려동물 이름")@RequestParam("name") String name,
                                                   @ApiParam("반려동물 나이")@RequestParam("age") String age,
                                                   @ApiParam("반려동물 성별")@RequestParam("sex") String sex,
                                                   @ApiParam("반려동물 종")@RequestParam("species") String species,
                                                   @ApiParam("반려동물 정보")@RequestParam("information") String information
                                     ) throws IOException {
        long memberId = authenticationGetMemberId.getMemberId();

        int intAge = Integer.parseInt(age);

        PetDto.Post petPostDto = PetDto.Post.builder()
                .images(images)
                .name(name)
                .age(intAge)
                .sex(sex)
                .species(species)
                .information(information)
                .build();
//        Pet mappingPet = petMapper.petPostDtoToPet(petPostDto);
        PetDto.Response responsePet = petService.createPet(memberId, petPostDto);


        return new ResponseEntity<>(responsePet, HttpStatus.CREATED);
    }

    @GetMapping("/{pet-id}")
    @Operation(summary = "펫 조회하기")
    public ResponseEntity<PetDto.Response> getPet(@ApiParam("반려동물")@PathVariable("pet-id") long petId) {
        PetDto.Response response = petService.getPet(petId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PatchMapping("/status/{pet-id}")
    @Operation(summary = "펫 정보 수정하기", description = "폼데이터 형식으로 주셔야 합니다")
    public ResponseEntity<PetDto.Response> patchPet(@ApiParam("반려동물 식별자")@PathVariable("pet-id") long petId,
                                                    @ApiParam("반려동물 이미지")@RequestParam(value = "images", required = false) MultipartFile images,
                                                    @ApiParam("반려동물 이름")@RequestParam("name") String name,
                                                    @ApiParam("반려동물 나이")@RequestParam("age") String age,
                                                    @ApiParam("반려동물 성별")@RequestParam("sex") String sex,
                                                    @ApiParam("반려동물 종")@RequestParam("species") String species,
                                                    @ApiParam("반려동물 정보")@RequestParam("information") String information) throws IOException {
        long memberId = authenticationGetMemberId.getMemberId();

        int intAge = Integer.parseInt(age);

        PetDto.Patch petPatchDto = PetDto.Patch.builder()
                .images(images)
                .name(name)
                .age(intAge)
                .sex(sex)
                .species(species)
                .information(information)
                .build();
        PetDto.Response response = petService.updatePet(memberId, petId, petPatchDto);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{pet-id}")
    @Operation(summary = "펫 정보 삭제하기", description = "자신의 반려동물의 id를 적어야 삭제 됩니다")
    public ResponseEntity<?> deletePet(@ApiParam("반려동물")@PathVariable("pet-id") long petId) {
        long memberId = authenticationGetMemberId.getMemberId();

        petService.deletePet(memberId, petId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
