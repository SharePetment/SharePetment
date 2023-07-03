package com.saecdo18.serverapplication.feeds.entity;

import com.saecdo18.serverapplication.base.BaseEntity;
import com.saecdo18.serverapplication.member.entity.Member;

import javax.persistence.*;
import java.util.List;

@Entity
public class Feed extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedId;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private int like;

    @Column(nullable = false)
    private String url;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "feed", cascade = CascadeType.REMOVE)
    private List<FeedLike> feedLikeList;

    @OneToMany(mappedBy = "feed", cascade = CascadeType.REMOVE)
    private List<FeedImage> feedImageList;






}
