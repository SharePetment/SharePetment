package com.saecdo18.petmily.member.service;

import com.saecdo18.petmily.image.dto.ImageDto;
import com.saecdo18.petmily.image.entity.Image;
import com.saecdo18.petmily.member.dto.FollowMemberDto;
import com.saecdo18.petmily.member.dto.MemberDto;
import com.saecdo18.petmily.member.entity.FollowMember;
import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.member.mapper.FollowMemberMapper;
import com.saecdo18.petmily.member.mapper.MemberMapper;
import com.saecdo18.petmily.member.repository.FollowMemberRepository;
import com.saecdo18.petmily.member.repository.MemberRepository;
import com.saecdo18.petmily.pet.dto.PetDto;
import com.saecdo18.petmily.pet.entity.PetImage;
import com.saecdo18.petmily.pet.mapper.PetMapper;
import com.saecdo18.petmily.pet.entity.Pet;
import com.saecdo18.petmily.pet.repository.PetImageRepository;
import com.saecdo18.petmily.pet.repository.PetRepository;
import com.saecdo18.petmily.pet.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final FollowMemberRepository followMemberRepository;
    private final PetRepository petRepository;
    private final MemberMapper memberMapper;
    private final FollowMemberMapper followMemberMapper;
    private final PetMapper petMapper;
    private final PetImageRepository petImageRepository;

    public Member createMember(Member member){
        Member findMember = methodVerifyNoneMember(member); //email를 통해 등록되지 않은 멤버이면 진행
        memberRepository.save(findMember);
        return findMember;
    }

    public MemberDto.Response getMember(long hostMemberId, long guestMemberId){
        Member hostMember = methodFindByMemberIdMember(hostMemberId);

        List<Pet> petList = petRepository.findByMember(hostMember);
        hostMember.updatePetList(petList);
        List<PetDto.Response> responsePets = new ArrayList<>();


        for(int i=0;i< petList.size();i++){
            Pet pet = petList.get(i);

            PetDto.Response petDto = petMapper.petToPetResponseDto(pet);

            petDto.setMemberId(pet.getMember().getMemberId());
            PetImage petImage = petImageRepository.findByPet(pet);
            Image image = petImage.getImage();
            ImageDto imageDto = petMapper.imageToImageDto(image);
            petDto.setImages(imageDto);


            responsePets.add(petDto);
        }

        boolean guestfollowing;
        Optional<FollowMember> findFollowStatus = followMemberRepository.findByFollowerMemberAndFollowingId(hostMember, guestMemberId);

        if (findFollowStatus.isEmpty()){
            guestfollowing=false;
        }
        else {
            FollowMember followMember = findFollowStatus.get();
            guestfollowing = followMember.isFollow();

        }

        MemberDto.Response response = memberMapper.memberToMemberResponseDto(hostMember);

        MemberDto.Info memberInfo = memberIdToMemberInfoDto(hostMemberId);
        response.setMemberInfo(memberInfo);

        response.setGuestFollow(guestfollowing);

        response.setPets(responsePets);

        return response;
    }

    public MemberDto.Response updateMemberStatus(long memberId, String nickname, String address){
        Member findMember = methodFindByMemberIdMember(memberId);
        MemberDto.Info memberInfo= memberIdToMemberInfoDto(memberId);
        findMember.update(nickname, address);
        MemberDto.Response responseMember = memberMapper.memberToMemberResponseDto(findMember);
        responseMember.setMemberInfo(memberInfo);
        return responseMember;
    }

    public FollowMemberDto.Response followMember(long followerId,long followingId){
        Member findFollower = methodFindByFollowerInMember(followerId);
        Optional<FollowMember> optionalFollowMember = followMemberRepository.findByFollowerMemberAndFollowingId(findFollower, followingId);

        if (optionalFollowMember.isEmpty()){
            FollowMember followMember =FollowMember.builder()
                    .followerMember(findFollower)
                    .followingId(followingId)
                    .follow(true)
                    .build();
            followMemberRepository.save(followMember);

            findFollower.updateFollowerCount(followMember.isFollow()); //member followerCount update

            FollowMemberDto.Response response = followMemberMapper.followMemberToFollowMemberResponseDto(followMember);
            return  response;
        }
        else{
            FollowMember followMember = optionalFollowMember.get();
            boolean follow = followMember.isFollow();
            followMember.updateFollow(!follow);

            findFollower.updateFollowerCount(followMember.isFollow());

            FollowMemberDto.Response response = followMemberMapper.followMemberToFollowMemberResponseDto(followMember);
            return  response;
        }
    }

    public List<FollowMemberDto.Response> followList(long followingId){
        List<FollowMember> followMemberList = followMemberRepository.findByFollowingId(followingId);
        List<FollowMemberDto.Response> responses = new ArrayList<>();
        for(FollowMember followMember:followMemberList){
            MemberDto.Info memberInfo = memberIdToMemberInfoDto(followMember.getFollowerMember().getMemberId());
            FollowMemberDto.Response response = followMemberMapper.followMemberToFollowMemberResponseDto(followMember);
            response.setMemberInfo(memberInfo);
            responses.add(response);
        }

//        List<FollowMemberDto.Response> responses = followMemberMapper.followMemberToFollowMemberResponseDtos(followMemberList);
        return  responses;
    }

    public MemberDto.Info changeImage(long memberId, long petId) {
        Member findMember = methodFindByMemberIdMember(memberId);
        Pet findPet = petRepository.findById(petId).orElseThrow(
                () -> new RuntimeException("펫을 찾을 수 없습니다.")
        );

        PetImage petImage = findPet.getPetImage();


        findMember.updateImageUrl(petImage.getImage().getUploadFileURL());

        Member saveMember = memberRepository.save(findMember);
        return MemberDto.Info.builder()
                .nickname(saveMember.getNickname())
                .memberId(saveMember.getMemberId())
                .imageURL(saveMember.getImageURL())
                .build();
    }

    public MemberDto.NickCheckResponse checkNickname(String nickname){
        String message = "";
        boolean enable=false;
        if(memberRepository.findByNickname(nickname).isPresent()){
            message = "중복된 닉네임입니다";

        }
        else {
            message = "사용가능한 닉네임입니다";
            enable=true;
        }
        return MemberDto.NickCheckResponse.builder().checkMessage(message).enable(enable).build();
    }

    private Member methodFindByFollowerInMember(long followerId) {
        return memberRepository.findById(followerId).orElseThrow(() -> new RuntimeException("팔로우 할 팔로워를 찾지 못했습니다"));
    }

    private Member methodFindByMemberIdMember(long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("수정할 멤버가 없습니다"));
    }


    private Member methodVerifyNoneMember(Member member) {
        Optional<Member> optionalMember = memberRepository.findByEmail(member.getEmail());
        if (optionalMember.isPresent()){
            throw new RuntimeException("이미 등록된 회원입니다");
        }
        return member;
    }

    public URI uriBuilder(long memberId, String basicURL) {
        return UriComponentsBuilder
                .fromUriString(basicURL)
                .path("/"+memberId)
                .build()
                .toUri();
    }

    private MemberDto.Info memberIdToMemberInfoDto(long memberId) {
        Member findMember = memberRepository.findById(memberId).orElseThrow(
                () -> new RuntimeException("사용자를 찾을 수 없습니다.")
        );

        return MemberDto.Info.builder()
                .memberId(findMember.getMemberId())
                .imageURL(findMember.getImageURL())
                .nickname(findMember.getNickname())
                .build();
    }


}
