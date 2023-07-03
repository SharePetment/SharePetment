package com.saecdo18.petmily.member.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@Entity
@NoArgsConstructor
public class FollowMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long followMemberId;

//    @JsonIgnore
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "MEMBER_ID")
//    private Member followerMember;
//
//    @JsonIgnore
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "MEMBER_ID")
//    private Member followingMember;

    private long followerId;
    private long followingId;
    private boolean follow=true;
}
