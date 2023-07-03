package com.saecdo18.petmily.member.entity;

import com.saecdo18.petmily.pet.entity.Pet;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String nickname;
    @Column(nullable = false)
    private String address;
    private String statusMessage;
    @Column(nullable = false)
    private Integer followerCount;

//    @OneToMany(mappedBy = "followerMember", cascade = CascadeType.REMOVE)
//    private List<FollowMember> followerMembers;
//
//    @OneToMany(mappedBy = "followingMember", cascade = CascadeType.REMOVE)
//    private List<FollowMember> followingMembers;

//    private List<Long> followerIds=new ArrayList<>();
//
//    private List<Long> followingIds=new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    private List<Pet> pets;
}
