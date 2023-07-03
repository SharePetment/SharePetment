package com.saecdo18.serverapplication.walkmate.post.entity;

import com.saecdo18.serverapplication.member.entity.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
public class WalkMate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long walkMatePostId;

    @ManyToOne
    @JoinColumn(name = "MEMBER")
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
    private int maximum;

    @Column
    private int like;

}
