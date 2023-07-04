package com.saecdo18.petmily.walkmate.comment.entity;

import com.saecdo18.petmily.member.entity.Member;
import com.saecdo18.petmily.walkmate.post.entity.WalkMate;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Entity
public class WalkMateComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long walkMateCommentsId;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer likes;

    @ManyToOne
    @JoinColumn(name = "WALKMATEPOST_ID")
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
}
