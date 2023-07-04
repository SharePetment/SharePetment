package com.saecdo18.petmily.pet.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;

@Data
public class PetDto {
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Post{
        @NotBlank
        private String profile;
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
        private String profile;

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
        private String profile;
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
