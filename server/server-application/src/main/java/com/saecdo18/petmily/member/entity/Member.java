package com.saecdo18.petmily.member.entity;

import com.saecdo18.petmily.base.BaseEntity;
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
//    private String statusMessage;

    private int followerCount;

    private boolean animalParents;

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

//    public void updateMessage(String statusMessage){
//        this.statusMessage=statusMessage;
//    }

    public void updateAnimalParents(boolean animalParents){
        this.animalParents=animalParents;
    }
}
