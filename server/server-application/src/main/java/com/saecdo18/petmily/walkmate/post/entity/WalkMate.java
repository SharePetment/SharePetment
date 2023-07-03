package com.saecdo18.petmily.walkmate.post.entity;

import com.saecdo18.petmily.member.entity.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
public class WalkMate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long walkMatePostId;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private String mapURL;

    @Column
    private String chatURL;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String time;

    @Column
    private Boolean open=true;

    @Column(nullable = false)
    private Integer maximum;

    @Column
    private Integer likes;

}
