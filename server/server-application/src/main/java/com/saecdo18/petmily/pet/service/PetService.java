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

        return pet;
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
