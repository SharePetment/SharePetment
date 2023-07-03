package com.saecdo18.serverapplication.member.entity;

import com.saecdo18.serverapplication.pet.entity.Pet;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long memberId;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String nickname;
    @Column(nullable = false)
    private String address;
    private String statusMessage;
    @Column(nullable = false)
    private int followerCount;

    @OneToMany(mappedBy = "followerMember", cascade = CascadeType.REMOVE)
    private List<FollowMember> followerMembers;

    @OneToMany(mappedBy = "followingMember", cascade = CascadeType.REMOVE)
    private List<FollowMember> followingMembers;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    private List<Pet> pets;
}
