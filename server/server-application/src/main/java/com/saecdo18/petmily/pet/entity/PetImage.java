package com.saecdo18.petmily.pet.entity;

import com.saecdo18.petmily.feed.entity.BaseEntity;
import com.saecdo18.petmily.feed.entity.Feed;
import com.saecdo18.petmily.image.entity.Image;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
public class PetImage extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long PetImageId;

    @OneToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "image_id")
    private Image image;

    @Builder
    public PetImage(Pet pet, Image image) {
        this.pet = pet;
        this.image = image;
    }
}
