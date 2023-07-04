package com.saecdo18.petmily.walkmate.comment.entity;

import com.saecdo18.petmily.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
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
    private Long walkMatePostId;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @Builder
    public WalkMateComment(String content, Integer likes, Long walkMatePostId, Member member) {

        this.content = content;
        this.likes = likes;
        this.walkMatePostId = walkMatePostId;
        this.member = member;
    }
}
