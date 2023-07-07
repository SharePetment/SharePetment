package com.saecdo18.petmily.member.entity;


import com.saecdo18.petmily.feed.entity.BaseEntity;
import com.saecdo18.petmily.pet.entity.Pet;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
public class Member extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

    private String kakaoName;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String nickname;
    @Column(nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(length = 1000)
    private String imageURL;

    private int followerCount;

    private boolean animalParents;

    private boolean guestFollowStatus;

    private String refreshToken;

    @OneToMany(mappedBy = "followerMember", cascade = CascadeType.REMOVE)
    private List<FollowMember> followMembers;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    private List<Pet> pets;


    @Builder(builderMethodName = "emailNicknameAddress")
    public Member(String email, String nickname, String address){
        this.email = email;
        this.nickname = nickname;
        this.address = address;
    }

    public void update(String nickname, String address) {
        this.nickname = nickname;
        this.address = address;
    }

    public void updateFollowerCount(boolean follow) {
        if (follow) {
            followerCount++;
        } else {
            followerCount--;
        }
    }

    public void updateAnimalParents(boolean animalParents){
        this.animalParents=animalParents;
    }

    public void updateGuestFollowStatus(boolean guestFollowStatus){
        this.guestFollowStatus = guestFollowStatus;
    }

    public void updatePetList(List<Pet> pets){ this.pets=pets; }

    public void updateImageUrl(String imageURL) {
        this.imageURL = imageURL;
    }

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    //    public void updateMessage(String statusMessage){
//        this.statusMessage=statusMessage;
//    }
}
