package com.saecdo18.serverapplication.pet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.saecdo18.serverapplication.member.entity.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Entity
@NoArgsConstructor
public class Pet {
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
    @Column(nullable = false)
    private boolean isWalkMated=false;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private Member member;
}
