package com.saecdo18.petmily.member.service;

import com.saecdo18.petmily.feed.entity.Feed;
import com.saecdo18.petmily.feed.entity.FeedImage;
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
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {
    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private MemberService memberService;

    @Mock
    private PetRepository petRepository;

    @Mock
    private PetImageRepository petImageRepository;

    @Mock
    private PetMapper petMapper;

    @Mock
    private FollowMemberRepository followMemberRepository;

    @Mock
    private MemberMapper memberMapper;

    @Mock
    private FollowMemberMapper followMemberMapper;

    @Test
    @DisplayName("회원 조회 성공")
    void getMemberSuccess() {


        long hostMemberId = 1L;
        long guestMemberId = 2L;

        Member hostMember = new Member();
        ReflectionTestUtils.setField(hostMember, "memberId", hostMemberId);

        Pet pet = new Pet();
        ReflectionTestUtils.setField(pet, "petId", 1L);
        ReflectionTestUtils.setField(pet, "name", "메시");
        ReflectionTestUtils.setField(pet, "member", hostMember);

        List<Pet> petList = List.of(pet);

        PetDto.Response petResponse = PetDto.Response.builder()
                .petId(1l)
                .name("메시")
                .build();

        Image image = Image.builder().originalFilename("image.jpg").uploadFileURL("http://image.jpg").build();

        PetImage petImage = new PetImage();
        ReflectionTestUtils.setField(petImage, "pet", pet);
        ReflectionTestUtils.setField(petImage, "image", image);

        ImageDto imageDto = ImageDto.builder()
                .imageId(1L)
                .originalFilename("image.jpg")
                .uploadFileURL("http://image.jpg")
                .build();

        FollowMember followMember = new FollowMember();
        ReflectionTestUtils.setField(followMember, "followerMember", hostMember);
        ReflectionTestUtils.setField(followMember, "followingId", guestMemberId);

        MemberDto.Response memberResponse = MemberDto.Response.builder()
                .build();

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(1L)
                .build();


        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(hostMember));
        given(petRepository.findByMember(Mockito.any(Member.class))).willReturn(petList);
        given(petMapper.petToPetResponseDto(Mockito.any(Pet.class))).willReturn(petResponse);
        given(petImageRepository.findByPet(Mockito.any(Pet.class))).willReturn(petImage);
        given(petMapper.imageToImageDto(Mockito.any(Image.class))).willReturn(imageDto);
        given(followMemberRepository.findByFollowerMemberAndFollowingId(Mockito.any(Member.class), Mockito.anyLong())).willReturn(Optional.of(followMember));
        given(memberMapper.memberToMemberResponseDto(Mockito.any(Member.class))).willReturn(memberResponse);
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(hostMember));

        // when
        memberService.getMember(hostMemberId, guestMemberId);


        verify(memberRepository, times(2)).findById(hostMemberId);
        verify(petRepository, times(1)).findByMember(hostMember);
    }

    @Test
    @DisplayName("회원 조회 실패 : 찾는 멤버가 없어서 생기는 예외")
    void getMemberNoneHostMember() {


        long hostMemberId = 1L;
        long guestMemberId = 2L;

        Member hostMember = new Member();
        ReflectionTestUtils.setField(hostMember, "memberId", hostMemberId);

        Pet pet = new Pet();
        ReflectionTestUtils.setField(pet, "petId", 1L);
        ReflectionTestUtils.setField(pet, "name", "메시");
        ReflectionTestUtils.setField(pet, "member", hostMember);

        List<Pet> petList = List.of(pet);

        PetDto.Response petResponse = PetDto.Response.builder()
                .petId(1l)
                .name("메시")
                .build();

        Image image = Image.builder().originalFilename("image.jpg").uploadFileURL("http://image.jpg").build();

        PetImage petImage = new PetImage();
        ReflectionTestUtils.setField(petImage, "pet", pet);
        ReflectionTestUtils.setField(petImage, "image", image);

        ImageDto imageDto = ImageDto.builder()
                .imageId(1L)
                .originalFilename("image.jpg")
                .uploadFileURL("http://image.jpg")
                .build();

        FollowMember followMember = new FollowMember();
        ReflectionTestUtils.setField(followMember, "followerMember", hostMember);
        ReflectionTestUtils.setField(followMember, "followingId", guestMemberId);

        MemberDto.Response memberResponse = MemberDto.Response.builder()
                .build();

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(1L)
                .build();


        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class , () -> memberService.getMember(hostMemberId, guestMemberId));

        assertEquals(exception.getMessage(), "수정할 멤버가 없습니다");
    }

    @Test
    @DisplayName("회원 수정 성공")
    void updateMemberStatusSuccess() {

        long memberId = 1L;
        String nickname = "닉네임";
        String address = "서울시 강서구 마곡동";

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        MemberDto.Response memberResponse = MemberDto.Response.builder()
                .build();

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(1L)
                .build();


        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(memberMapper.memberToMemberResponseDto(Mockito.any(Member.class))).willReturn(memberResponse);


        // when
        memberService.updateMemberStatus(memberId, nickname, address);


        verify(memberRepository, times(2)).findById(memberId);

    }

    @Test
    @DisplayName("회원 수정 실패 : 찾는 멤버가 없어서 생기는 예외")
    void updateMemberStatusNoneMember() {

        long memberId = 1L;
        String nickname = "닉네임";
        String address = "서울시 강서구 마곡동";

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        MemberDto.Response memberResponse = MemberDto.Response.builder()
                .build();

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(1L)
                .build();


        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class , () -> memberService.updateMemberStatus(memberId, nickname, address));

        assertEquals(exception.getMessage(), "수정할 멤버가 없습니다");

    }

    @Test
    @DisplayName("팔로잉 신청 성공")
    void followMemberSuccess() {

        long memberId = 1L;

        long followingId = 2L;

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        MemberDto.Response memberResponse = MemberDto.Response.builder()
                .build();

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(1L)
                .build();

        FollowMember followMember = new FollowMember();
        ReflectionTestUtils.setField(followMember, "followerMember", member);
        ReflectionTestUtils.setField(followMember, "followingId", followingId);

        FollowMemberDto.Response followMemberResponse = FollowMemberDto.Response.builder()
                .memberInfo(memberInfo)
                .build();


        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(followMemberRepository.findByFollowerMemberAndFollowingId(Mockito.any(Member.class), Mockito.anyLong())).willReturn(Optional.of(followMember));
        given(followMemberMapper.followMemberToFollowMemberResponseDto(Mockito.any(FollowMember.class))).willReturn(followMemberResponse);


        // when
        memberService.followMember(memberId, followingId);


        verify(memberRepository, times(2)).findById(memberId);

    }

    @Test
    @DisplayName("팔로잉 신청 실패 : 찾는 멤버가 없어서 생기는 예외")
    void followMemberNoneMember() {

        long memberId = 1L;

        long followingId = 2L;

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        MemberDto.Response memberResponse = MemberDto.Response.builder()
                .build();

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(1L)
                .build();

        FollowMember followMember = new FollowMember();
        ReflectionTestUtils.setField(followMember, "followerMember", member);
        ReflectionTestUtils.setField(followMember, "followingId", followingId);

        FollowMemberDto.Response followMemberResponse = FollowMemberDto.Response.builder()
                .memberInfo(memberInfo)
                .build();


        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class , () -> memberService.followMember(memberId, followingId));

        assertEquals(exception.getMessage(), "팔로우 할 팔로워를 찾지 못했습니다");

    }

    @Test
    @DisplayName("팔로잉 리스트 가져오기 성공")
    void followListSuccess() {

        long memberId = 1L;

        long followingId = 2L;

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        MemberDto.Response memberResponse = MemberDto.Response.builder()
                .build();

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(1L)
                .build();

        FollowMember followMember = new FollowMember();
        ReflectionTestUtils.setField(followMember, "followerMember", member);
        ReflectionTestUtils.setField(followMember, "followingId", followingId);

        List<FollowMember> followMemberList = List.of(followMember);

        FollowMemberDto.Response followMemberResponse = FollowMemberDto.Response.builder()
                .memberInfo(memberInfo)
                .build();


        given(followMemberRepository.findByFollowingId(Mockito.anyLong())).willReturn(Optional.of(followMemberList));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.of(member));
        given(followMemberMapper.followMemberToFollowMemberResponseDto(Mockito.any(FollowMember.class))).willReturn(followMemberResponse);

        // when
        memberService.followList(followingId);

    }

    @Test
    @DisplayName("팔로잉 리스트 가져오기 실패 : 찾는 멤버가 없어서 생기는 예외")
    void followListNoneMember() {

        long memberId = 1L;

        long followingId = 2L;

        Member member = new Member();
        ReflectionTestUtils.setField(member, "memberId", memberId);

        MemberDto.Response memberResponse = MemberDto.Response.builder()
                .build();

        MemberDto.Info memberInfo = MemberDto.Info.builder()
                .memberId(1L)
                .build();

        FollowMember followMember = new FollowMember();
        ReflectionTestUtils.setField(followMember, "followerMember", member);
        ReflectionTestUtils.setField(followMember, "followingId", followingId);

        List<FollowMember> followMemberList = List.of(followMember);

        FollowMemberDto.Response followMemberResponse = FollowMemberDto.Response.builder()
                .memberInfo(memberInfo)
                .build();


        given(followMemberRepository.findByFollowingId(Mockito.anyLong())).willReturn(Optional.of(followMemberList));
        given(memberRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class , () -> memberService.followList(followingId));

        assertEquals(exception.getMessage(), "사용자를 찾을 수 없습니다");
    }

    @Test
    void changeImage() {
    }

    @Test
    void checkNickname() {
    }
}