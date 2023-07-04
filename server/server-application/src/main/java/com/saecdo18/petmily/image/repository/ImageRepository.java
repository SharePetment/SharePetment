package com.saecdo18.petmily.image.repository;

import com.saecdo18.petmily.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
