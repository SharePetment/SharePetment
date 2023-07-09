package com.saecdo18.petmily.member.entity;


import com.saecdo18.petmily.feed.entity.BaseEntity;
import com.saecdo18.petmily.pet.entity.Pet;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
@ToString
public class Member extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

    private String name;

    private String email;

    private String nickname;

    private String address;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(length = 1000)
    private String imageURL;

    private int followerCount;
    private int feedCount;

    private boolean animalParents;


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


    public void updateRegisterMember(String name, String email){
        this.email = email;
        this.name = name;
        this.role=Role.GUEST;
    }

    public void update(String nickname, String address) {
        this.nickname = nickname;
        this.address = address;
    }

    public void upCountFeed(){
        feedCount++;
    }
    public void downCountFeed(){
        feedCount--;
    }
    public void updateUserRole(){
        this.role=Role.USER;
    }

    public void updateGuestRole(){
        this.role=Role.GUEST;
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


    public void updatePetList(List<Pet> pets){ this.pets=pets; }

    public void updateImageUrl(String imageURL) {
        this.imageURL = imageURL;
    }

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }


    public void setDefaultImage(){
        this.imageURL = "https://main-project-junyoung.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5%E1%84%91%E1%85%B3%E1%84%89%E1%85%A1.jpeg";
    }
}
