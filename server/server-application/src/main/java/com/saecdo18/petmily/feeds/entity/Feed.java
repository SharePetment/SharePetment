package com.saecdo18.petmily.feeds.entity;

import com.saecdo18.petmily.base.BaseEntity;
import com.saecdo18.petmily.member.entity.Member;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.util.UriComponentsBuilder;

import javax.persistence.*;
import java.net.URI;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
public class Feed extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedId;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer likes;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "feed", cascade = CascadeType.REMOVE)
    private List<FeedLike> feedLikeList;

    @OneToMany(mappedBy = "feed", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    private List<FeedImage> feedImageList;

    @Builder
    public Feed(String content, Member member) {
        this.content = content;
        this.member = member;
        this.likes = 0;
    }

    public URI getShareURI(String uri) {
        return UriComponentsBuilder
                .fromUriString(uri)
                .path(String.valueOf(feedId))
                .build()
                .toUri();
    }

    public void likeCount(boolean like) {
        if(like)
            likes++;
        else
            likes--;
    }

}
