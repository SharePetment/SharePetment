package com.saecdo18.serverapplication.feeds.entity;

import com.saecdo18.serverapplication.base.BaseEntity;
import com.saecdo18.serverapplication.image.entity.Image;
import lombok.Builder;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor
public class FeedImage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long FeedImageId;

    @ManyToOne
    @JoinColumn(name = "feed_id")
    private Feed feed;

    @ManyToOne
    @JoinColumn(name = "image_id")
    private Image image;

    @Builder
    public FeedImage(Feed feed, Image image) {
        this.feed = feed;
        this.image = image;
    }
}
