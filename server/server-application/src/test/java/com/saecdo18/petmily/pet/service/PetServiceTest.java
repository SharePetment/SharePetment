package com.saecdo18.petmily.pet.service;

import com.saecdo18.petmily.awsConfig.S3UploadService;
import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.image.entity.Image;
import com.saecdo18.petmily.image.repository.ImageRepository;
import com.saecdo18.petmily.member.dto.FollowMemberDto;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.FollowMember;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.member.service.MemberService;
import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.Pet;
import com.saecdo18.petmily.pet.entity.PetImage;
import com.saecdo18.petmily.pet.mapper.PetMapper;
import com.saecdo18.petmily.pet.repository.PetImageRepository;
import com.saecdo18.petmily.pet.repository.PetRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PetServiceTest {

    @InjectMocks
    private PetService petService;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private S3UploadService s3UploadService;

    @Mock
    private PetRepository petRepository;

    @Mock
    private PetMapper petMapper;

    @Mock
    private PetImageRepository petImageRepository;

    @Mock
    private ImageRepository imageRepository;

    @Test
    @DisplayName("펫 등록하기 성공")
    void createPetSuccess() throws IOException {
        long memberId = 1L;
        String uploadFileURL = "http://image.jpg";

        MultipartFile images = new MockMultipartFile("image", "gitimage.png", "image/png",
                new FileInputStream(getClass().getResource("/gitimage.png").getFile()));

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        PetDto.Post petPostDto = PetDto.Post.builder()
                .images(images)
                .name("메시")
                .build();

        Pet pet = new Pet();
        ReflectionTestUtils.setField(pet, "petId", 1L);
        ReflectionTestUtils.setField(pet, "name", "메시");
        ReflectionTestUtils.setField(pet, "member", member);

        MemberDto.Response memberResponse = MemberDto.Response.builder()
                .build();

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(1L)
                .build();

        PetDto.Response petResponse = PetDto.Response.builder()
                .build();

        Image image = Image.builder().uploadFileURL(uploadFileURL).build();

        PetImage petImage = new PetImage();
        ReflectionTestUtils.setField(petImage,"PetImageId", 1L);
        ReflectionTestUtils.setField(petImage, "pet", pet);
        ReflectionTestUtils.setField(petImage, "image", image);

        ImageDto imageDto = ImageDto.builder()
                .imageId(1L)
                .originalFilename("gitimage.png")
                .uploadFileURL("image/png/gitimage.png")
                .build();


        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(s3UploadService.saveFile(Mockito.any(MultipartFile.class), Mockito.anyString())).willReturn(uploadFileURL);
        given(imageRepository.save(Mockito.any(Image.class))).willReturn(image);  //savePetImage
        given(petRepository.save(Mockito.any(Pet.class))).willReturn(pet);

        given(petRepository.findById(Mockito.anyLong())).willReturn(Optional.of(pet));
        given(petMapper.petToPetResponseDto(pet)).willReturn(petResponse);
        given(petImageRepository.findByPet(Mockito.any(Pet.class))).willReturn(petImage);
        given(petMapper.imageToImageDto(Mockito.any(Image.class))).willReturn(imageDto);

        // when
        petService.createPet(memberId, petPostDto);

    }

    @Test
    @DisplayName("펫 등록하기 실패 : 멤버가 없을 경우 예외")
    void createPetNoneMember() throws IOException {
        long memberId = 1L;
        String uploadFileURL = "http://image.jpg";

        MultipartFile images = new MockMultipartFile("image", "gitimage.png", "image/png",
                new FileInputStream(getClass().getResource("/gitimage.png").getFile()));

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        PetDto.Post petPostDto = PetDto.Post.builder()
                .images(images)
                .name("메시")
                .build();

        Pet pet = new Pet();
        ReflectionTestUtils.setField(pet, "petId", 1L);
        ReflectionTestUtils.setField(pet, "name", "메시");
        ReflectionTestUtils.setField(pet, "member", member);

        MemberDto.Response memberResponse = MemberDto.Response.builder()
                .build();

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(1L)
                .build();

        PetDto.Response petResponse = PetDto.Response.builder()
                .build();

        Image image = Image.builder().uploadFileURL(uploadFileURL).build();

        PetImage petImage = new PetImage();
        ReflectionTestUtils.setField(petImage,"PetImageId", 1L);
        ReflectionTestUtils.setField(petImage, "pet", pet);
        ReflectionTestUtils.setField(petImage, "image", image);

        ImageDto imageDto = ImageDto.builder()
                .imageId(1L)
                .originalFilename("gitimage.png")
                .uploadFileURL("image/png/gitimage.png")
                .build();


        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, () -> petService.createPet(memberId,petPostDto));

        assertEquals(exception.getMessage(), "해당 견주가 존재하지 않습니다");

    }

    @Test
    @DisplayName("펫 조회하기 성공")
    void getPetSuccess() {
        long petId = 1L;
        long memberId = 1L;
        String uploadFileURL = "http://image.jpg";

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);


        Pet pet = new Pet();
        ReflectionTestUtils.setField(pet, "petId", 1L);
        ReflectionTestUtils.setField(pet, "name", "메시");
        ReflectionTestUtils.setField(pet, "member", member);


        PetDto.Response petResponse = PetDto.Response.builder()
                .build();

        Image image = Image.builder().uploadFileURL(uploadFileURL).build();

        PetImage petImage = new PetImage();
        ReflectionTestUtils.setField(petImage,"PetImageId", 1L);
        ReflectionTestUtils.setField(petImage, "pet", pet);
        ReflectionTestUtils.setField(petImage, "image", image);

        ImageDto imageDto = ImageDto.builder()
                .imageId(1L)
                .originalFilename("gitimage.png")
                .uploadFileURL("image/png/gitimage.png")
                .build();


        given(petRepository.findById(Mockito.anyLong())).willReturn(Optional.of(pet));
        given(petMapper.petToPetResponseDto(pet)).willReturn(petResponse);
        given(petImageRepository.findByPet(Mockito.any(Pet.class))).willReturn(petImage);
        given(petMapper.imageToImageDto(Mockito.any(Image.class))).willReturn(imageDto);

        // when
        petService.getPet(petId);
    }

    @Test
    @DisplayName("펫 조회하기 실패 : 해당 펫이 없는 경우 예외")
    void getPetNonePet() {
        long petId = 1L;
        long memberId = 1L;
        String uploadFileURL = "http://image.jpg";

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);


        Pet pet = new Pet();
        ReflectionTestUtils.setField(pet, "petId", 1L);
        ReflectionTestUtils.setField(pet, "name", "메시");
        ReflectionTestUtils.setField(pet, "member", member);


        PetDto.Response petResponse = PetDto.Response.builder()
                .build();

        Image image = Image.builder().uploadFileURL(uploadFileURL).build();

        PetImage petImage = new PetImage();
        ReflectionTestUtils.setField(petImage,"PetImageId", 1L);
        ReflectionTestUtils.setField(petImage, "pet", pet);
        ReflectionTestUtils.setField(petImage, "image", image);

        ImageDto imageDto = ImageDto.builder()
                .imageId(1L)
                .originalFilename("gitimage.png")
                .uploadFileURL("image/png/gitimage.png")
                .build();


        given(petRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class, () -> petService.getPet(petId));

        assertEquals(exception.getMessage(), "찾으시는 반려동물이 없습니다");

    }

    @Test
    @DisplayName("펫 정보 수정하기 성공")
    void updatePetSuccess() throws IOException {

        long petId=1L;
        long memberId = 1L;
        String uploadFileURL = "http://image.jpg";

        MultipartFile images = new MockMultipartFile("image", "gitimage.png", "image/png",
                new FileInputStream(getClass().getResource("/gitimage.png").getFile()));

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        PetDto.Patch petPatchDto = PetDto.Patch.builder()
                .images(images)
                .name("메시")
                .build();

        Pet pet = new Pet();
        ReflectionTestUtils.setField(pet, "petId", 1L);
        ReflectionTestUtils.setField(pet, "name", "메시");
        ReflectionTestUtils.setField(pet, "member", member);

        MemberDto.Response memberResponse = MemberDto.Response.builder()
                .build();

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(1L)
                .build();

        PetDto.Response petResponse = PetDto.Response.builder()
                .build();

        Image image = Image.builder().uploadFileURL(uploadFileURL).build();

        PetImage petImage = new PetImage();
        ReflectionTestUtils.setField(petImage,"PetImageId", 1L);
        ReflectionTestUtils.setField(petImage, "pet", pet);
        ReflectionTestUtils.setField(petImage, "image", image);

        ReflectionTestUtils.setField(pet, "petImage",petImage);

        ImageDto imageDto = ImageDto.builder()
                .imageId(1L)
                .originalFilename("gitimage.png")
                .uploadFileURL("image/png/gitimage.png")
                .build();


        given(petRepository.findById(Mockito.anyLong())).willReturn(Optional.of(pet));
        given(s3UploadService.saveFile(Mockito.any(MultipartFile.class), Mockito.anyString())).willReturn(uploadFileURL);
        given(imageRepository.save(Mockito.any(Image.class))).willReturn(image);  //savePetImage

        given(petRepository.findById(Mockito.anyLong())).willReturn(Optional.of(pet));
        given(petMapper.petToPetResponseDto(pet)).willReturn(petResponse);
        given(petImageRepository.findByPet(Mockito.any(Pet.class))).willReturn(petImage);
        given(petMapper.imageToImageDto(Mockito.any(Image.class))).willReturn(imageDto);



        // when
        petService.updatePet(memberId, petId, petPatchDto);
    }

    @Test
    @DisplayName("펫 삭제 성공")
    void deletePetSuccess() throws IOException {

        long petId = 1L;
        long memberId = 1L;
        String uploadFileURL = "http://image.jpg";

        MultipartFile images = new MockMultipartFile("image", "gitimage.png", "image/png",
                new FileInputStream(getClass().getResource("/gitimage.png").getFile()));

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        PetDto.Post petPostDto = PetDto.Post.builder()
                .images(images)
                .name("메시")
                .build();

        Pet pet = new Pet();
        ReflectionTestUtils.setField(pet, "petId", 1L);
        ReflectionTestUtils.setField(pet, "name", "메시");
        ReflectionTestUtils.setField(pet, "member", member);


        Image image = Image.builder().uploadFileURL(uploadFileURL).build();

        PetImage petImage = new PetImage();
        ReflectionTestUtils.setField(petImage,"PetImageId", 1L);
        ReflectionTestUtils.setField(petImage, "pet", pet);
        ReflectionTestUtils.setField(petImage, "image", image);

        List<Pet> petList = List.of(pet);

        ReflectionTestUtils.setField(member, "pets", petList);

        ReflectionTestUtils.setField(pet, "petImage", petImage);

        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(petRepository.findById(Mockito.anyLong())).willReturn(Optional.of(pet));
        given(petRepository.findFirstByMemberOrderByCreatedAtAsc(Mockito.any(Member.class))).willReturn(Optional.of(pet));



        // when
        petService.deletePet(memberId, petId);
    }

    @Test
    @DisplayName("펫 이미지 변경 메소드 성공")
    void savePetImage() {

        long memberId=1L;

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        Pet pet = new Pet();
        ReflectionTestUtils.setField(pet, "petId", 1L);
        ReflectionTestUtils.setField(pet, "name", "메시");
        ReflectionTestUtils.setField(pet, "member", member);


        String uploadFileURL = "http://image.jpg";
        String originalFilename = "gitimage.png";

        Image image = Image.builder().uploadFileURL(uploadFileURL).build();

        given(imageRepository.save(Mockito.any(Image.class))).willReturn(image);

        petService.savePetImage(pet, originalFilename, uploadFileURL);
    }
}