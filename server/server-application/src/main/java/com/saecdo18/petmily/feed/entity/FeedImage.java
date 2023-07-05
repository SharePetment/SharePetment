package com.saecdo18.petmily.feed.entity;

import com.saecdo18.petmily.image.entity.Image;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
public class FeedImage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long FeedImageId;

    @ManyToOne
    @JoinColumn(name = "feed_id")
    private Feed feed;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "image_id")
    private Image image;

    @Builder
    public FeedImage(Feed feed, Image image) {
        this.feed = feed;
        this.image = image;
    }
}
