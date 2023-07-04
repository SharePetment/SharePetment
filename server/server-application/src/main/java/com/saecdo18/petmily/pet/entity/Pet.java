package com.saecdo18.petmily.pet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.saecdo18.petmily.base.BaseEntity;
import com.saecdo18.petmily.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@Entity
@NoArgsConstructor
public class Pet extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long petId;
    @Column(nullable = false)
    private String profile;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private int age;
    @Column(nullable = false)
    private String sex;
    @Column(nullable = false)
    private String species;
    private String information;
    private String statusMessage;

    private boolean walkMated=true;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @Builder(builderMethodName = "nonePetIdAndMessage")
    public Pet(String profile, String name, int age,
               String sex, String species, String information,
               boolean walkMated){
        this.profile=profile;
        this.name=name;
        this.age=age;
        this.sex=sex;
        this.species=species;
        this.information=information;
        this.walkMated=walkMated;
    }

    public void updateMember(Member member){
        this.member=member;
    }
}
