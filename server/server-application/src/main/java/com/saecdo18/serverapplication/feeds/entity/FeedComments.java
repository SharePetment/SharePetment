package com.saecdo18.serverapplication.feeds.entity;

import com.saecdo18.serverapplication.base.BaseEntity;
import com.saecdo18.serverapplication.member.entity.Member;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor
public class FeedComments extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedCommentsId;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private int like;

    @ManyToOne
    @JoinColumn(name = "feed_id")
    private Feed feed;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

}
