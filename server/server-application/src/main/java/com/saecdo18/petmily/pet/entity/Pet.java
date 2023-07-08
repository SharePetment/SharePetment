package com.saecdo18.petmily.pet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.saecdo18.petmily.feed.entity.BaseEntity;
import com.saecdo18.petmily.feed.entity.FeedImage;
import com.saecdo18.petmily.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
public class Pet extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long petId;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private int age;
    @Column(nullable = false)
    private String sex;
    @Column(nullable = false)
    private String species;
    private String information;
//    private String statusMessage;


    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @OneToOne(mappedBy = "pet", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    private PetImage petImage;

    @Builder(builderMethodName = "nonePetIdAndMessage")
    public Pet( String name, int age,
               String sex, String species, String information){

        this.name=name;
        this.age=age;
        this.sex=sex;
        this.species=species;
        this.information=information;

    }

    public void updatePatch( String name, int age,
                            String sex, String species, String information){

        this.name=name;
        this.age=age;
        this.sex=sex;
        this.species=species;
        this.information=information;

    }

    public void updateMember(Member member){
        this.member=member;
    }
}
