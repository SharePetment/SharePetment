package com.saecdo18.petmily.pet.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;

public class PetServiceDto {

    @Getter
    @Builder
    public static class Post{
        private MultipartFile images;
        private String name;
        private int age;
        private String sex;
        private String species;
        private String information;

    }

    @Getter
    @Builder
    public static class Patch{
        private MultipartFile images;
        private String name;
        private int age;
        private String sex;
        private String species;
        private String information;


    }
}
