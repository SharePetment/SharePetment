package com.saecdo18.petmily.pet.dto;

import com.saecdo18.petmily.image.dto.ImageDto;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class PetDto {

//    @AllArgsConstructor
//    @NoArgsConstructor
    @Getter
    @Builder
    public static class Post{

        private MultipartFile images;
        @NotBlank
        private String name;
        private int age;
        @NotBlank
        private String sex;
        @NotBlank
        private String species;
        private String information;


    }

    @Getter
    @Builder
    public static class Patch{
//        private String profile;
        private MultipartFile images;

        private String name;
        private int age;

        private String sex;

        private String species;
        private String information;


    }

    @Getter
    @Builder
    @Setter
    public static class Response {
        private Long petId;
        //        private String profile;
        private ImageDto images;
        private String name;
        private int age;
        private String sex;
        private String species;
        private String information;
        private long memberId;
        private String createdAt;
        private String modifiedAt;


    }



}
