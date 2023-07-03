package com.saecdo18.serverapplication.walkmate.post.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class WalkMate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long walkMatePostId;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private long memberId;

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
    private Boolean open;

    @Column(nullable = false)
    private int maximum;

    @Column
    private int like;

}
