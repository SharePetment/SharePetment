package com.saecdo18.petmily.walkmate.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.saecdo18.petmily.feed.entity.BaseEntity;
import com.saecdo18.petmily.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
public class WalkMateComment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long walkMateCommentId;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer likes;


    @ManyToOne
    @JoinColumn(name = "walkmatepost_id") //수정
    private WalkMate walkMate;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @Builder
    public WalkMateComment(String content, Integer likes, WalkMate walkMate, Member member) {

        this.content = content;
        this.likes = likes;
        this.walkMate = walkMate;
        this.member = member;
    }

    public WalkMateComment(String content, Member member) {
        this.content = content;
        this.member = member;
    }

    public void setContent(String content){
        this.content = content;
    }
}
