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
        private boolean walkMated;

    }

    @Getter
    public static class Patch{
//        private String profile;
        private MultipartFile images;

        private String name;
        private int age;

        private String sex;

        private String species;
        private String information;
        private boolean walkMated;

    }

    @Getter
    @Builder
    public static class Response{
        private Long petId;
//        private String profile;
        private List<ImageDto> images;
        private String name;
        private int age;
        private String sex;
        private String species;
        private String information;
//        private String statusMessage;
        private boolean walkMated;
        private long memberId;
        private String createdAt;
        private String modifiedAt;

        public void setMemberId(long memberId) {
            this.memberId = memberId;
        }

        public void setImages(List<ImageDto> images) {
            this.images = images;
        }

        public void setWalkMated(boolean walkMated){
            this.walkMated=walkMated;
        }



        //        @Builder(builderMethodName = "NoneStatusMessageAndMemberId")
//        public Response(Long petId,String profile,
//                        String name,int age,
//                        String sex,String species,String information,
//                        boolean isWalkMated){
//            this.petId=petId;
//            this.profile=profile;
//            this.name=name;
//            this.age=age;
//            this.sex=sex;
//            this.species=species;
//            this.information=information;
//            this.isWalkMated=isWalkMated;
//        }
    }
}
