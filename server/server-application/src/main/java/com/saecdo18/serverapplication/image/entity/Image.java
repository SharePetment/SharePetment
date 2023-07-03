package com.saecdo18.serverapplication.image.entity;

import com.saecdo18.serverapplication.base.BaseEntity;
import lombok.Builder;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor
public class Image extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    @Column(nullable = false)
    private String source;

    @Builder
    public Image(String source) {
        this.source = source;
    }
}
