package com.saecdo18.petmily.feed.entity;

import com.saecdo18.petmily.member.entity.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
public class FeedComments extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedCommentsId;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer likes;

    @ManyToOne
    @JoinColumn(name = "feed_id")
    private Feed feed;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

}
