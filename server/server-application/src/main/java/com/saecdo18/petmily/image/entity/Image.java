package com.saecdo18.petmily.image.entity;

import com.saecdo18.petmily.base.BaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
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
