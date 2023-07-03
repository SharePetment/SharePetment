package com.saecdo18.serverapplication.feeds.entity;

import com.saecdo18.serverapplication.base.BaseEntity;
import com.saecdo18.serverapplication.member.entity.Member;
import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
public class FeedLike extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedLikeId;

    @ManyToOne
    @JoinColumn(name = "feed_id")
    private Feed feed;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(nullable = false)
    private boolean isLike;
}
