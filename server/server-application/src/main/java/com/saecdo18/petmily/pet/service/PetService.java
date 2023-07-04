package com.saecdo18.petmily.pet.service;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.member.service.MemberService;
import com.saecdo18.petmily.pet.PetMapper;
import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.Pet;
import com.saecdo18.petmily.pet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class PetService {
    private final PetRepository petRepository;
    private final PetMapper petMapper;
    private final MemberRepository memberRepository;
    private final MemberService memberService;

    public PetDto.Response createPet(long memberId, Pet pet){
        Member findMember = methodFindByMemberIdMember(memberId);
        pet.updateMember(findMember);
        petRepository.save(pet);

        if(!findMember.isAnimalParents()){
            findMember.updateAnimalParents(true);
        }
        PetDto.Response responsePet = petMapper.petToPetResponseDto(pet);
        responsePet.setMemberId(pet.getMember().getMemberId());

        return responsePet;
    }

    public PetDto.Response getPet(long petId){
        Pet findPet = methodFindByPetId(petId);
        PetDto.Response response = petMapper.petToPetResponseDto(findPet);
        response.setMemberId(findPet.getMember().getMemberId());
        return response;
    }

    public PetDto.Response updatePet(long memberId, long petId, Pet patchPet){
        Pet findPet = methodFindByPetId(petId);
        if(memberId == findPet.getMember().getMemberId()){
            findPet.updatePatch(patchPet.getProfile(),
                    patchPet.getName(),
                    patchPet.getAge(),
                    patchPet.getSex(),
                    patchPet.getSpecies(),
                    patchPet.getInformation(),
                    patchPet.isWalkMated());

//            Pet.PetBuilder findPetBuilder = findPet.nonePetIdAndMessage();
//            findPetBuilder.profile(patchPet.getProfile());
//            findPetBuilder.name(patchPet.getName());
//            findPetBuilder.age(patchPet.getAge());
//            findPetBuilder.sex(patchPet.getSex());
//            findPetBuilder.species(patchPet.getSpecies());
//            findPetBuilder.information(patchPet.getInformation());
//            findPetBuilder.walkMated(patchPet.isWalkMated());


        }
        else {
            throw new RuntimeException("반려동물의 수정권한이 없습니다.");
        }

        PetDto.Response response = petMapper.petToPetResponseDto(findPet);
        return response;
    }





    private Pet methodFindByPetId(long petId) {
        return petRepository.findById(petId).orElseThrow(() -> new RuntimeException("찾으시는 반려동물이 없습니다"));
    }

    private Pet methodFindByMember(Member findMember) {
        return petRepository.findByMember(findMember)
                .orElseThrow(() -> new RuntimeException("해당 멤버가 없습니다"));
    }

    private Member methodFindByMemberIdMember(long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 견주가 존재하지 않습니다"));
    }
}
