package com.saecdo18.petmily.feeds.entity;

import com.saecdo18.petmily.base.BaseEntity;
import com.saecdo18.petmily.member.entity.Member;
import lombok.Getter;

import javax.persistence.*;
import java.util.List;

@Getter
@Entity
public class Feed extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedId;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer likes;

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
