package com.saecdo18.petmily.pet.service;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.repository.MemberRepository;
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

    public Pet createPet(long memberId, Pet pet){
        Member findMember = methodFindByMemberIdMember(memberId);
        pet.updateMember(findMember);
        petRepository.save(pet);

        if(!findMember.isAnimalParents()){
            findMember.updateAnimalParents(true);
        }

        return pet;
    }

    public Pet getPet(long petId){
        return methodFindByPetId(petId);
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
