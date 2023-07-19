package com.saecdo18.petmily.feed.entity;

import com.saecdo18.petmily.member.entity.Member;
import lombok.Builder;
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

    @Builder
    public FeedComments(String content, Feed feed, Member member) {
        this.content = content;
        this.feed = feed;
        this.member = member;
        this.likes = 0;
    }

    public void likeCount(boolean like) {
        if(like)
            likes++;
        else
            likes--;
    }

    public void updateContent(String content) {
        this.content = content;
    }

}
