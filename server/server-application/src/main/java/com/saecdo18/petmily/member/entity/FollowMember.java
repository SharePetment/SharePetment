package com.saecdo18.petmily.member.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.saecdo18.petmily.feed.entity.BaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@Entity
@NoArgsConstructor
public class FollowMember extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long followMemberId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private Member followerMember;

    private long followingId;


    @Builder
    public FollowMember(Member followerMember, long followingId){
        this.followerMember=followerMember;
        this.followingId=followingId;

    }

    

    //    @JsonIgnore
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "MEMBER_ID")
//    private Member followingMember;

//    private long followerId;
}
