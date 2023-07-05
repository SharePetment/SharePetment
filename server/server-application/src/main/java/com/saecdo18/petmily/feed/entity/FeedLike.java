package com.saecdo18.petmily.feed.entity;

import com.saecdo18.petmily.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
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

    @Builder
    public FeedLike(Feed feed, Member member) {
        this.feed = feed;
        this.member = member;
        this.isLike = true;
    }

    public void updateIsLike() {
        this.isLike = !isLike;
    }
}
