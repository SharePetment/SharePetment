package com.saecdo18.petmily.walkmate.entity;

import com.saecdo18.petmily.feed.entity.BaseEntity;
import com.saecdo18.petmily.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
public class WalkMateLike extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long walkLikeId;

    @ManyToOne
    @JoinColumn(name = "walkmatepost_id")
    private WalkMate walk;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @Column(nullable = false)
    private boolean isLike;

    @Builder
    public WalkMateLike(WalkMate walk, Member member){
        this.walk=walk;
        this.member=member;
        this.isLike=true;
    }

    public void updateIsLikes(){
        this.isLike = !isLike;
    }

}