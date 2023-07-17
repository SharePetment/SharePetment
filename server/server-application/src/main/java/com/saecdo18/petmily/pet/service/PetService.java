package com.saecdo18.petmily.pet.service;

import com.saecdo18.petmily.awsConfig.S3UploadService;
import com.saecdo18.petmily.feed.dto.FeedCommentDto;
import com.saecdo18.petmily.feed.dto.FeedDto;
import com.saecdo18.petmily.feed.entity.Feed;
import com.saecdo18.petmily.feed.entity.FeedImage;
import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.image.entity.Image;
import com.saecdo18.petmily.image.repository.ImageRepository;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.member.service.MemberService;
import com.saecdo18.petmily.pet.dto.PetServiceDto;
import com.saecdo18.petmily.pet.entity.PetImage;
import com.saecdo18.petmily.pet.mapper.PetMapper;
import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.Pet;
import com.saecdo18.petmily.pet.repository.PetImageRepository;
import com.saecdo18.petmily.pet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Transactional
@Service
@RequiredArgsConstructor
public class PetService {
    private final PetRepository petRepository;
    private final PetMapper petMapper;
    private final MemberRepository memberRepository;
    private final PetImageRepository petImageRepository;
    private final ImageRepository imageRepository;
    private final S3UploadService s3UploadService;
    private final MemberService memberService;
    private final static String BASE_IMAGE_URL = "https://main-project-junyoung.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5%E1%84%91%E1%85%B3%E1%84%89%E1%85%A1.jpeg";

    public PetDto.Response createPet(long memberId, PetServiceDto.Post petPostDto) throws IOException {
        Member findMember = methodFindByMemberIdMember(memberId);

        Pet pet = Pet.nonePetIdAndMessage()
                        .name(petPostDto.getName())
                        .age(petPostDto.getAge())
                        .sex(petPostDto.getSex())
                        .species(petPostDto.getSpecies())
                        .information(petPostDto.getInformation())
                        .build();

        pet.updateMember(findMember);
        String uploadFileURL = BASE_IMAGE_URL;

        if (!petPostDto.getImages().isEmpty()) {
            String originalFilename = petPostDto.getImages().getOriginalFilename()+ UUID.randomUUID();
            uploadFileURL = s3UploadService.saveFile(petPostDto.getImages(), originalFilename);
            savePetImage(pet, originalFilename, uploadFileURL);
        }
        Pet savePet = petRepository.save(pet);

        if(!findMember.isAnimalParents()){
            findMember.updateAnimalParents(true);
            findMember.updateImageUrl(uploadFileURL);
            findMember.updateUserRole();
        }

        return getPet(savePet.getPetId());
    }



    public PetDto.Response getPet(long petId){
        Pet findPet = methodFindByPetId(petId);
//        PetDto.Response response = petMapper.petToPetResponseDto(findPet);

        return changePetToPetDtoResponse(findPet);
    }


    public PetDto.Response updatePet(long memberId, long petId, PetServiceDto.Patch patchPet)throws IOException{
        Pet findPet = methodFindByPetId(petId);

        if(memberId != findPet.getMember().getMemberId()){
            throw new RuntimeException("반려동물의 수정권한이 없습니다.");
        }

        findPet.updatePatch(
                patchPet.getName(),
                patchPet.getAge(),
                patchPet.getSex(),
                patchPet.getSpecies(),
                patchPet.getInformation());
        if (!patchPet.getImages().isEmpty()) {
            s3UploadService.deleteImage(findPet.getPetImage().getImage().getOriginalFilename());
            petImageRepository.delete(findPet.getPetImage());

            String originalFilename = patchPet.getImages().getOriginalFilename()+ UUID.randomUUID();
            String uploadFileURL = s3UploadService.saveFile(patchPet.getImages(), originalFilename);
            savePetImage(findPet, originalFilename, uploadFileURL);

        }

        return getPet(findPet.getPetId());
    }

    public void deletePet(long memberId, long petId) {
        Member findMember = methodFindByMemberIdMember(memberId);
        Pet findPet = methodFindByPetId(petId);
        petRepository.delete(findPet);
        petRepository.flush();

        if (findMember.getPets().isEmpty()) {
            findMember.updateAnimalParents(false);
            findMember.updateImageUrl(BASE_IMAGE_URL);
            findMember.updateGuestRole();
        } else {
            Optional<Pet> firstPet = petRepository.findFirstByMemberOrderByCreatedAtAsc(findMember);
            if (firstPet.isPresent()) {
                Pet pet = firstPet.get();
                PetImage images = pet.getPetImage();

                findMember.updateImageUrl(images.getImage().getUploadFileURL());

            }
        }
    }

    private PetDto.Response changePetToPetDtoResponse(Pet pet) {
        PetDto.Response response = petMapper.petToPetResponseDto(pet);

        response.setMemberId(pet.getMember().getMemberId());
        PetImage petImage = petImageRepository.findByPet(pet);
        Image image = petImage.getImage();
        ImageDto imageDto = petMapper.imageToImageDto(image);
        response.setImages(imageDto);

        return response;
    }

    private List<ImageDto> petImageToImageDtoList(List<PetImage> petImageList) {
        List<ImageDto> imageDtoList = new ArrayList<>();
        for (PetImage petImage : petImageList) {
            Image image = petImage.getImage();
            imageDtoList.add(petMapper.imageToImageDto(image));
        }
        return imageDtoList;
    }



    public void savePetImage(Pet pet, String originalFilename, String uploadFileURL) {
        Image image = Image.builder()
                .originalFilename(originalFilename)
                .uploadFileURL(uploadFileURL)
                .build();
        Image saveImage = imageRepository.save(image);
        PetImage petImage = PetImage.builder()
                .pet(pet)
                .image(saveImage)
                .build();

        petImageRepository.save(petImage);
    }

    private Pet methodFindByPetId(long petId) {
        return petRepository.findById(petId).orElseThrow(() -> new RuntimeException("찾으시는 반려동물이 없습니다"));
    }


    private Member methodFindByMemberIdMember(long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 견주가 존재하지 않습니다"));
    }
}
